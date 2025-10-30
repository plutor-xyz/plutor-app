# 02 - Database Schema Design

## Overview

This document defines the complete PostgreSQL database schema for Plutor MVP. The schema is production-ready and designed to be scalable, even though we're implementing it off-chain for the MVP.

## Core Principles

1. **Normalization**: Minimize data redundancy
2. **Indexing**: Optimize for common queries
3. **Audit Trail**: Track all changes with timestamps
4. **Soft Deletes**: Use status flags instead of hard deletes
5. **JSON Flexibility**: Use JSONB for flexible data structures
6. **Full-Text Search**: Enable search on relevant fields

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id          │───┐
│ wallet_addr │   │
│ did         │   │
│ email       │   │
│ ...         │   │
└─────────────┘   │
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ UserProfile │   │  Invoice    │
├─────────────┤   ├─────────────┤
│ id          │   │ id          │
│ user_id     │   │ issuer_id   │───┐
│ company     │   │ recipient_id│───┤
│ ...         │   │ status      │   │
└─────────────┘   │ total       │   │
                  │ ...         │   │
                  └─────────────┘   │
                         │          │
                         ▼          │
                  ┌─────────────┐   │
                  │InvoiceItem │   │
                  ├─────────────┤   │
                  │ id          │   │
                  │ invoice_id  │   │
                  │ description │   │
                  │ ...         │   │
                  └─────────────┘   │
                                    │
                         ┌──────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │  Payment    │
                  ├─────────────┤
                  │ id          │
                  │ invoice_id  │
                  │ tx_signature│
                  │ ...         │
                  └─────────────┘
```

## Complete Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ENUMS
// ============================================================================

enum UserRole {
  USER
  ADMIN
}

enum InvoiceStatus {
  DRAFT      // Created but not sent
  SENT       // Sent to recipient
  VIEWED     // Recipient viewed the invoice
  PAID       // Payment completed
  OVERDUE    // Past due date and not paid
  CANCELLED  // Cancelled by issuer
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum EmailStatus {
  PENDING
  SENT
  DELIVERED
  FAILED
}

// ============================================================================
// USER & PROFILE
// ============================================================================

model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Wallet & Identity
  walletAddress String  @unique @map("wallet_address")
  did           String  @unique // did:solana:xxxxx
  email         String  @unique
  emailVerified Boolean @default(false) @map("email_verified")

  // Role & Status
  role   UserRole @default(USER)
  active Boolean  @default(true)

  // Onboarding
  onboardingCompleted Boolean   @default(false) @map("onboarding_completed")
  onboardingStep      Int       @default(0) @map("onboarding_step")
  agreedToTerms       Boolean   @default(false) @map("agreed_to_terms")
  agreedToTermsAt     DateTime? @map("agreed_to_terms_at")

  // Relations
  profile           UserProfile?
  issuedInvoices    Invoice[]    @relation("InvoiceIssuer")
  receivedInvoices  Invoice[]    @relation("InvoiceRecipient")
  payments          Payment[]
  emailNotifications EmailNotification[]

  @@map("users")
  @@index([walletAddress])
  @@index([email])
  @@index([did])
}

model UserProfile {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId String @unique @map("user_id")
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Personal/Business Information
  firstName   String? @map("first_name")
  lastName    String? @map("last_name")
  companyName String? @map("company_name")
  
  // Contact Information
  phone        String?
  website      String?
  
  // Address
  addressLine1 String? @map("address_line_1")
  addressLine2 String? @map("address_line_2")
  city         String?
  state        String?
  postalCode   String? @map("postal_code")
  country      String?

  // Business Details
  businessType        String? @map("business_type") // Individual, LLC, Corporation, etc.
  taxId               String? @map("tax_id") // VAT, EIN, etc.
  registrationNumber  String? @map("registration_number")
  
  // Banking (for display purposes, not actual banking)
  defaultCurrency     String  @default("USD") @map("default_currency")
  
  // Branding
  logo                String? // URL to logo
  primaryColor        String? @map("primary_color")

  // Invoice Settings
  invoicePrefix       String  @default("INV") @map("invoice_prefix")
  nextInvoiceNumber   Int     @default(1000) @map("next_invoice_number")
  defaultPaymentTerms Int     @default(30) @map("default_payment_terms") // days
  
  // Notes
  notes               String? // Internal notes

  @@map("user_profiles")
  @@index([userId])
}

// ============================================================================
// INVOICE
// ============================================================================

model Invoice {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Invoice Number
  invoiceNumber String  @unique @map("invoice_number") // INV-1000
  
  // Parties
  issuerId    String @map("issuer_id")
  recipientId String @map("recipient_id")
  
  issuer    User @relation("InvoiceIssuer", fields: [issuerId], references: [id])
  recipient User @relation("InvoiceRecipient", fields: [recipientId], references: [id])

  // Status & Dates
  status        InvoiceStatus @default(DRAFT)
  issueDate     DateTime      @default(now()) @map("issue_date")
  dueDate       DateTime      @map("due_date")
  paidDate      DateTime?     @map("paid_date")
  sentDate      DateTime?     @map("sent_date")
  viewedDate    DateTime?     @map("viewed_date")
  cancelledDate DateTime?     @map("cancelled_date")

  // Financial Details
  currency       String  @default("USD")
  subtotal       Decimal @db.Decimal(12, 2) // Before tax
  taxRate        Decimal @default(0) @db.Decimal(5, 2) // Percentage
  taxAmount      Decimal @default(0) @db.Decimal(12, 2)
  discountAmount Decimal @default(0) @db.Decimal(12, 2)
  total          Decimal @db.Decimal(12, 2) // Final amount
  
  // Payment Terms
  paymentTerms Int @map("payment_terms") // days (e.g., 30 for Net 30)
  
  // Notes
  notes         String? @db.Text // Internal notes
  customerNotes String? @db.Text @map("customer_notes") // Notes visible to customer
  termsAndConditions String? @db.Text @map("terms_and_conditions")

  // Metadata
  metadata Json? // Flexible field for additional data

  // PDF
  pdfUrl       String? @map("pdf_url") // Link to generated PDF
  pdfGeneratedAt DateTime? @map("pdf_generated_at")

  // Relations
  items    InvoiceItem[]
  payments Payment[]
  emailNotifications EmailNotification[]

  @@map("invoices")
  @@index([issuerId])
  @@index([recipientId])
  @@index([status])
  @@index([invoiceNumber])
  @@index([dueDate])
  @@index([issueDate])
}

model InvoiceItem {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  invoiceId String  @map("invoice_id")
  invoice   Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  // Item Details
  description String  @db.Text
  quantity    Decimal @db.Decimal(10, 2)
  unitPrice   Decimal @db.Decimal(12, 2) @map("unit_price")
  amount      Decimal @db.Decimal(12, 2) // quantity * unitPrice
  
  // Optional
  unit        String? // e.g., "hours", "pieces", "kg"
  sku         String? // Stock Keeping Unit
  
  // Order
  sortOrder   Int     @default(0) @map("sort_order")

  @@map("invoice_items")
  @@index([invoiceId])
}

// ============================================================================
// PAYMENT
// ============================================================================

model Payment {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  invoiceId String  @map("invoice_id")
  payerId   String  @map("payer_id")
  
  invoice Invoice @relation(fields: [invoiceId], references: [id])
  payer   User    @relation(fields: [payerId], references: [id])

  // Payment Details
  amount            Decimal @db.Decimal(12, 2)
  currency          String  @default("USD")
  platformFee       Decimal @db.Decimal(12, 2) @map("platform_fee") // 2% fee
  netAmount         Decimal @db.Decimal(12, 2) @map("net_amount") // amount - platformFee
  
  // Blockchain Transaction
  transactionSignature String  @unique @map("transaction_signature") // Solana tx signature
  fromWallet          String  @map("from_wallet") // Payer wallet address
  toWallet            String  @map("to_wallet") // Issuer wallet address
  adminWallet         String  @map("admin_wallet") // Admin wallet (receives fee)
  
  // Status
  status          PaymentStatus @default(PENDING)
  processedAt     DateTime?     @map("processed_at")
  confirmedAt     DateTime?     @map("confirmed_at")
  failedAt        DateTime?     @map("failed_at")
  failureReason   String?       @map("failure_reason")
  
  // Blockchain Confirmation
  blockTime       DateTime? @map("block_time")
  slot            BigInt?
  confirmations   Int       @default(0)

  // Metadata
  metadata Json? // Additional data

  @@map("payments")
  @@index([invoiceId])
  @@index([payerId])
  @@index([transactionSignature])
  @@index([status])
  @@index([createdAt])
}

// ============================================================================
// EMAIL NOTIFICATIONS
// ============================================================================

model EmailNotification {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userId    String  @map("user_id")
  invoiceId String? @map("invoice_id")
  
  user    User     @relation(fields: [userId], references: [id])
  invoice Invoice? @relation(fields: [invoiceId], references: [id])

  // Email Details
  emailTo      String    @map("email_to")
  emailFrom    String    @map("email_from")
  subject      String
  emailType    String    @map("email_type") // invoice_sent, payment_received, etc.
  
  // Status
  status       EmailStatus @default(PENDING)
  sentAt       DateTime?   @map("sent_at")
  deliveredAt  DateTime?   @map("delivered_at")
  failedAt     DateTime?   @map("failed_at")
  failureReason String?    @map("failure_reason")
  
  // External Service
  externalId   String?     @map("external_id") // Resend/SendGrid message ID
  
  // Content (optional, for debugging)
  htmlContent  String?     @db.Text @map("html_content")
  textContent  String?     @db.Text @map("text_content")

  @@map("email_notifications")
  @@index([userId])
  @@index([invoiceId])
  @@index([status])
  @@index([emailType])
  @@index([createdAt])
}

// ============================================================================
// AUDIT LOG (Optional but Recommended)
// ============================================================================

model AuditLog {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())

  // Who
  userId    String? @map("user_id")
  userEmail String? @map("user_email")
  
  // What
  action      String // CREATE_INVOICE, UPDATE_INVOICE, SEND_PAYMENT, etc.
  entity      String // Invoice, Payment, User, etc.
  entityId    String @map("entity_id")
  
  // Context
  ipAddress   String? @map("ip_address")
  userAgent   String? @map("user_agent")
  
  // Changes
  oldValues   Json?   @map("old_values")
  newValues   Json?   @map("new_values")
  
  // Metadata
  metadata    Json?

  @@map("audit_logs")
  @@index([userId])
  @@index([entity, entityId])
  @@index([action])
  @@index([createdAt])
}
```

## Indexes Explanation

### Performance-Critical Indexes

1. **User Lookups**
    - `walletAddress` - Primary user identification
    - `email` - Login and notifications
    - `did` - DID-based queries

2. **Invoice Queries**
    - `issuerId`, `recipientId` - User's invoices
    - `status` - Filter by status
    - `invoiceNumber` - Quick lookup
    - `dueDate`, `issueDate` - Date-based filtering

3. **Payment Tracking**
    - `transactionSignature` - Blockchain verification
    - `status` - Payment status filtering
    - `createdAt` - Chronological ordering

4. **Full-Text Search** (Setup separately)
    - Invoice descriptions
    - Company names
    - Customer notes

## Full-Text Search Setup

After creating tables, run these SQL commands:

```sql
-- Add GIN indexes for full-text search
CREATE INDEX invoices_search_idx ON invoices 
USING GIN (to_tsvector('english', 
  coalesce(invoice_number, '') || ' ' || 
  coalesce(notes, '') || ' ' || 
  coalesce(customer_notes, '')
));

CREATE INDEX invoice_items_search_idx ON invoice_items 
USING GIN (to_tsvector('english', description));

CREATE INDEX user_profiles_search_idx ON user_profiles 
USING GIN (to_tsvector('english', 
  coalesce(company_name, '') || ' ' || 
  coalesce(first_name, '') || ' ' || 
  coalesce(last_name, '')
));
```

## Migration Commands

### 1. Create Initial Migration

```bash
npx prisma migrate dev --name init
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Seed Database (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { createDID } from '../src/lib/crypto/did';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const adminWallet = 'AdminWalletPublicKeyHere';
  const adminDID = createDID();

  const admin = await prisma.user.upsert({
    where: { walletAddress: adminWallet },
    update: {},
    create: {
      walletAddress: adminWallet,
      did: adminDID,
      email: 'admin@plutor.app',
      emailVerified: true,
      role: 'ADMIN',
      onboardingCompleted: true,
      profile: {
        create: {
          companyName: 'Plutor Platform',
          firstName: 'Admin',
          lastName: 'User',
          country: 'US',
        },
      },
    },
  });

  console.log('Admin user created:', admin);

  // Create test users
  const testUsers = [
    {
      wallet: 'TestUser1WalletAddress',
      email: 'user1@example.com',
      companyName: 'Acme Corp',
    },
    {
      wallet: 'TestUser2WalletAddress',
      email: 'user2@example.com',
      companyName: 'Tech Innovations Ltd',
    },
  ];

  for (const testUser of testUsers) {
    const did = createDID();
    await prisma.user.upsert({
      where: { walletAddress: testUser.wallet },
      update: {},
      create: {
        walletAddress: testUser.wallet,
        did,
        email: testUser.email,
        emailVerified: true,
        onboardingCompleted: true,
        profile: {
          create: {
            companyName: testUser.companyName,
            country: 'US',
          },
        },
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Update `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run seed:

```bash
npx prisma db seed
```

## Common Queries

### User Queries

```typescript
// Find user by wallet
const user = await prisma.user.findUnique({
  where: { walletAddress: '...' },
  include: { profile: true },
});

// Find user by DID
const user = await prisma.user.findUnique({
  where: { did: 'did:solana:...' },
  include: { profile: true },
});

// Search users
const users = await prisma.user.findMany({
  where: {
    profile: {
      OR: [
        { companyName: { contains: searchTerm, mode: 'insensitive' } },
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
  },
});
```

### Invoice Queries

```typescript
// Get user's issued invoices
const invoices = await prisma.invoice.findMany({
  where: { issuerId: userId },
  include: {
    recipient: { include: { profile: true } },
    items: true,
    payments: true,
  },
  orderBy: { createdAt: 'desc' },
});

// Get user's received invoices
const invoices = await prisma.invoice.findMany({
  where: { recipientId: userId },
  include: {
    issuer: { include: { profile: true } },
    items: true,
    payments: true,
  },
});

// Filter invoices
const overdueInvoices = await prisma.invoice.findMany({
  where: {
    status: 'OVERDUE',
    recipientId: userId,
  },
});

// Full-text search
const results = await prisma.$queryRaw`
  SELECT * FROM invoices
  WHERE to_tsvector('english', invoice_number || ' ' || coalesce(notes, '')) 
  @@ plainto_tsquery('english', ${searchTerm})
`;
```

### Payment Queries

```typescript
// Get invoice payments
const payments = await prisma.payment.findMany({
  where: { invoiceId: invoiceId },
  include: {
    payer: { include: { profile: true } },
    invoice: true,
  },
});

// Get payment by transaction signature
const payment = await prisma.payment.findUnique({
  where: { transactionSignature: txSignature },
});
```

## Database Maintenance

### Backup

```bash
# Dump database
pg_dump plutor > backup_$(date +%Y%m%d).sql

# Restore database
psql plutor < backup_20241030.sql
```

### Reset Database

```bash
npx prisma migrate reset
```

### View Database

```bash
npx prisma studio
```

Access at http://localhost:5555

## Next Steps

1. ✅ Database schema defined
2. → Proceed to `03-WALLET-INTEGRATION.md` for Solana wallet setup
3. → Then implement authentication with wallet

## Performance Tips

1. **Use select() to limit fields**
   ```typescript
   prisma.user.findMany({
     select: { id: true, email: true }
   });
   ```

2. **Use pagination**
   ```typescript
   prisma.invoice.findMany({
     skip: (page - 1) * limit,
     take: limit,
   });
   ```

3. **Use transactions for related operations**
   ```typescript
   await prisma.$transaction([
     prisma.invoice.update(...),
     prisma.payment.create(...),
   ]);
   ```

4. **Monitor slow queries**
   Enable query logging in development