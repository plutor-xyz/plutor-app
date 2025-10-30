bash

cat > /home/claude/07-PAYMENT-FLOW.md << 'EOF'
# 07 - Payment Flow Implementation

## Overview

Implement the payment flow with Solana wallet signature and transaction processing.

## Payment Button Component

`src/components/invoice/PayInvoiceButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PayInvoiceButtonProps {
  invoice: any;
  onSuccess?: () => void;
}

const PLATFORM_FEE_PERCENTAGE = 0.02; // 2%
const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS!;

export function PayInvoiceButton({ invoice, onSuccess }: PayInvoiceButtonProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const totalAmount = parseFloat(invoice.total);
      const platformFee = totalAmount * PLATFORM_FEE_PERCENTAGE;
      const netAmount = totalAmount - platformFee;

      // Convert USD to lamports (for demo, using 1:1 ratio)
      const lamports = Math.floor(totalAmount * LAMPORTS_PER_SOL);
      const feeLamports = Math.floor(platformFee * LAMPORTS_PER_SOL);
      const netLamports = lamports - feeLamports;

      // Create transaction
      const transaction = new Transaction();

      // Transfer net amount to issuer
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(invoice.issuer.walletAddress),
          lamports: netLamports,
        })
      );

      // Transfer fee to admin
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(ADMIN_WALLET),
          lamports: feeLamports,
        })
      );

      // Get latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign transaction
      const signedTransaction = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());

      // Confirm transaction
      await connection.confirmTransaction(signature, 'confirmed');

      // Record payment in database
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': publicKey.toString(),
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          transactionSignature: signature,
          amount: totalAmount,
          platformFee,
          netAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to record payment');
      }

      onSuccess?.();
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (invoice.status === 'PAID') {
    return <Button disabled>Already Paid</Button>;
  }

  return (
    <div>
      <Button onClick={handlePayment} disabled={loading} size="lg" className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ${invoice.total} ${invoice.currency}`
        )}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
```

## Payment Recording API

`src/app/api/payments/route.ts`:

```typescript
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');
    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId, transactionSignature, amount, platformFee, netAmount } = await request.json();

    // Find payer
    const payer = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!payer) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { issuer: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Create payment and update invoice in transaction
    const payment = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          payerId: payer.id,
          amount: new Decimal(amount),
          currency: invoice.currency,
          platformFee: new Decimal(platformFee),
          netAmount: new Decimal(netAmount),
          transactionSignature,
          fromWallet: walletAddress,
          toWallet: invoice.issuer.walletAddress,
          adminWallet: process.env.ADMIN_WALLET_ADDRESS!,
          status: 'COMPLETED',
          processedAt: new Date(),
          confirmedAt: new Date(),
        },
      });

      // Update invoice status
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidDate: new Date(),
        },
      });

      return payment;
    });

    // Send email notifications
    // TODO: Implement email sending

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error recording payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Payment Confirmation Component

`src/components/invoice/PaymentConfirmation.tsx`:

```typescript
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentConfirmationProps {
  payment: any;
  onClose: () => void;
}

export function PaymentConfirmation({ payment, onClose }: PaymentConfirmationProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
          <div>
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>Your payment has been processed</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Amount Paid</div>
            <div className="font-medium">${parseFloat(payment.amount).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Platform Fee</div>
            <div className="font-medium">${parseFloat(payment.platformFee).toFixed(2)}</div>
          </div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground mb-1">Transaction Signature</div>
          <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
            {payment.transactionSignature}
          </code>
        </div>

        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Next Steps
