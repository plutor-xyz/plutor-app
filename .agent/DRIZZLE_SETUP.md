bash

cat > /mnt/user-data/outputs/QUICK-SETUP-DRIZZLE.md << 'EOF'
# Plutor MVP - Quick Setup with Drizzle (Minimal)

## 15-Minute Setup

```bash
# 1. Create project
npx create-next-app@latest plutor --typescript --tailwind --app
cd plutor

# 2. Install ONLY essential dependencies
npm install drizzle-orm postgres \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets \
  @solana/web3.js \
  @react-pdf/renderer

# 3. Install dev dependencies
npm install -D drizzle-kit @types/node

# 4. Setup database
createdb plutor

# 5. Create .env.local
cat > .env.local << 'ENVFILE'
DATABASE_URL=postgresql://localhost:5432/plutor
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_ADMIN_WALLET=YourWalletAddressHere
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENVFILE

# 6. Setup Drizzle
mkdir -p src/lib
```

## Drizzle Configuration

### 1. Create `drizzle.config.ts` (root directory)

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

### 2. Create `src/lib/schema.ts`

```typescript
import { pgTable, serial, text, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  walletAddress: text('wallet_address').notNull().unique(),
  email: text('email').notNull(),
  companyName: text('company_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  issuerWallet: text('issuer_wallet').notNull(),
  recipientWallet: text('recipient_wallet').notNull(),
  amount: numeric('amount').notNull(), // SOL amount
  status: text('status').notNull().default('sent'), // sent or paid
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  dueDate: timestamp('due_date').notNull(),
  paidAt: timestamp('paid_at'),
  txSignature: text('tx_signature'), // Solana transaction signature
});

export const invoiceItems = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull().references(() => invoices.id),
  description: text('description').notNull(),
  quantity: numeric('quantity').notNull(),
  price: numeric('price').notNull(), // in SOL
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
```

### 3. Create `src/lib/db.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
```

### 4. Create `src/lib/queries.ts` (Common Queries)

```typescript
import { db } from './db';
import { users, invoices, invoiceItems } from './schema';
import { eq, and, or } from 'drizzle-orm';

// User queries
export async function getUserByWallet(walletAddress: string) {
  return db.query.users.findFirst({
    where: eq(users.walletAddress, walletAddress),
  });
}

export async function createUser(data: typeof users.$inferInsert) {
  return db.insert(users).values(data).returning();
}

// Invoice queries
export async function getInvoicesByWallet(walletAddress: string) {
  return db.query.invoices.findMany({
    where: or(
      eq(invoices.issuerWallet, walletAddress),
      eq(invoices.recipientWallet, walletAddress)
    ),
    with: {
      items: true,
    },
    orderBy: (invoices, { desc }) => [desc(invoices.createdAt)],
  });
}

export async function getInvoiceById(id: number) {
  return db.query.invoices.findFirst({
    where: eq(invoices.id, id),
    with: {
      items: true,
    },
  });
}

export async function createInvoice(
  invoiceData: typeof invoices.$inferInsert,
  items: typeof invoiceItems.$inferInsert[]
) {
  return db.transaction(async (tx) => {
    const [invoice] = await tx.insert(invoices).values(invoiceData).returning();
    
    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoiceId: invoice.id,
    }));
    
    await tx.insert(invoiceItems).values(itemsWithInvoiceId);
    
    return invoice;
  });
}

export async function updateInvoiceStatus(id: number, status: string, txSignature?: string) {
  return db.update(invoices)
    .set({ 
      status, 
      paidAt: status === 'paid' ? new Date() : null,
      txSignature: txSignature || null,
    })
    .where(eq(invoices.id, id))
    .returning();
}
```

## Database Migration

### Generate Migration

```bash
npx drizzle-kit generate:pg
```

### Push to Database

```bash
npx drizzle-kit push:pg
```

### Or use SQL directly

```bash
# Connect to database
psql plutor

# Create tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  issuer_wallet TEXT NOT NULL,
  recipient_wallet TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP NOT NULL,
  paid_at TIMESTAMP,
  tx_signature TEXT
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id),
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_invoices_issuer ON invoices(issuer_wallet);
CREATE INDEX idx_invoices_recipient ON invoices(recipient_wallet);
```

## Simple API Routes

### `src/app/api/user/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getUserByWallet, createUser } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get('x-wallet-address');
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet' }, { status: 401 });
  }

  const user = await getUserByWallet(walletAddress);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(request: NextRequest) {
  const { walletAddress, email, companyName } = await request.json();

  const [user] = await createUser({
    walletAddress,
    email,
    companyName,
  });

  return NextResponse.json(user, { status: 201 });
}
```

### `src/app/api/invoice/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getInvoicesByWallet, createInvoice } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const walletAddress = request.headers.get('x-wallet-address');
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet' }, { status: 401 });
  }

  const invoices = await getInvoicesByWallet(walletAddress);
  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const walletAddress = request.headers.get('x-wallet-address');
  if (!walletAddress) {
    return NextResponse.json({ error: 'No wallet' }, { status: 401 });
  }

  const { recipientWallet, amount, notes, items } = await request.json();

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}`;

  // Calculate due date (30 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const invoice = await createInvoice(
    {
      invoiceNumber,
      issuerWallet: walletAddress,
      recipientWallet,
      amount,
      notes,
      dueDate,
      status: 'sent',
    },
    items
  );

  return NextResponse.json(invoice, { status: 201 });
}
```

### `src/app/api/pay/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { updateInvoiceStatus, getInvoiceById } from '@/lib/queries';

export async function POST(request: NextRequest) {
  const { invoiceId, txSignature } = await request.json();

  const invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (invoice.status === 'paid') {
    return NextResponse.json({ error: 'Already paid' }, { status: 400 });
  }

  const [updated] = await updateInvoiceStatus(invoiceId, 'paid', txSignature);

  return NextResponse.json(updated);
}
```

## Wallet Context (Same as Before)

`src/components/WalletProvider.tsx`:

```typescript
'use client';

import { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC!;
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

## Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Start Development

```bash
# Generate migrations
npm run db:generate

# Push to database
npm run db:push

# Start dev server
npm run dev
```

## View Database

```bash
# Drizzle Studio (like Prisma Studio)
npm run db:studio
```

Opens at http://localhost:4983

## That's It!

Drizzle setup complete. Much simpler than Prisma:
- ✅ No `prisma generate` needed
- ✅ Direct SQL-like queries
- ✅ Type-safe by default
- ✅ Faster and lighter
- ✅ Easy migrations
