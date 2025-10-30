# 03 - Wallet Integration Guide

## Overview

This guide covers integrating Solana wallet functionality into Plutor. We'll use the Solana Wallet Adapter library to support multiple wallets (Phantom, Solflare, Backpack, etc.).

## Installation

Already installed in project setup, but for reference:

```bash
npm install @solana/wallet-adapter-base \
            @solana/wallet-adapter-react \
            @solana/wallet-adapter-react-ui \
            @solana/wallet-adapter-wallets \
            @solana/web3.js
```

## Wallet Context Provider

### 1. Create Wallet Provider Component

Create `src/components/wallet/WalletContextProvider.tsx`:

```typescript
'use client';

import { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  // Get network from environment variable
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || 'devnet';
  
  // Use custom RPC URL or default to cluster URL
  const endpoint = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    return clusterApiUrl(network);
  }, [network]);

  // Initialize all wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
```

### 2. Add Provider to Root Layout

Update `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletContextProvider } from '@/components/wallet/WalletContextProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plutor - On-Chain Invoicing',
  description: 'Global decentralized invoicing protocol',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
```

## Wallet Connect Button

### Create Custom Connect Button

Create `src/components/wallet/WalletButton.tsx`:

```typescript
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function WalletButton() {
  return (
    <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !rounded-lg !h-10 !px-6 !font-medium" />
  );
}

export function WalletButtonWithAuth() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected && publicKey) {
      // Check if user exists in database
      checkAndRedirectUser(publicKey.toString());
    }
  }, [connected, publicKey]);

  const checkAndRedirectUser = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (data.exists) {
        if (!data.onboardingCompleted) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  return <WalletButton />;
}
```

### Create Wallet Disconnect Button

Create `src/components/wallet/WalletDisconnectButton.tsx`:

```typescript
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function WalletDisconnectButton() {
  const { disconnect, connected } = useWallet();

  if (!connected) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => disconnect()}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Disconnect
    </Button>
  );
}
```

## Wallet Hooks

### Create Custom Wallet Hooks

Create `src/hooks/useWalletAuth.ts`:

```typescript
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

export interface WalletUser {
  id: string;
  walletAddress: string;
  did: string;
  email: string;
  onboardingCompleted: boolean;
  profile?: {
    companyName?: string;
    firstName?: string;
    lastName?: string;
  };
}

export function useWalletAuth() {
  const { publicKey, connected, disconnect } = useWallet();
  const [user, setUser] = useState<WalletUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (connected && publicKey) {
      fetchUser(publicKey.toString());
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [connected, publicKey]);

  const fetchUser = async (walletAddress: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/me', {
        headers: {
          'x-wallet-address': walletAddress,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await disconnect();
    setUser(null);
  };

  return {
    user,
    loading,
    connected,
    walletAddress: publicKey?.toString() || null,
    logout,
  };
}
```

### Create Wallet Balance Hook

Create `src/hooks/useWalletBalance.ts`:

```typescript
'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export function useWalletBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!publicKey) {
      setBalance(null);
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        setLoading(true);
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, [publicKey, connection]);

  return { balance, loading };
}
```

## Auth API Routes

### Check User Endpoint

Create `src/app/api/auth/check/route.ts`:

```typescript
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: {
        id: true,
        onboardingCompleted: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      onboardingCompleted: user.onboardingCompleted,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error('Error checking user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Get Current User Endpoint

Create `src/app/api/users/me/route.ts`:

```typescript
import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Protected Route Component

### Create Route Protection HOC

Create `src/components/wallet/ProtectedRoute.tsx`:

```typescript
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { connected } = useWallet();
  const { user, loading } = useWalletAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!connected) {
        router.push('/');
      } else if (requireOnboarding && user && !user.onboardingCompleted) {
        router.push('/onboarding');
      }
    }
  }, [connected, user, loading, requireOnboarding, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!connected || (requireOnboarding && user && !user.onboardingCompleted)) {
    return null;
  }

  return <>{children}</>;
}
```

## Wallet Display Components

### Create Wallet Address Display

Create `src/components/wallet/WalletAddress.tsx`:

```typescript
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function WalletAddress({ className }: { className?: string }) {
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!publicKey) return null;

  const address = publicKey.toString();
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{shortAddress}</code>
      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
```

### Create Wallet Balance Display

Create `src/components/wallet/WalletBalanceDisplay.tsx`:

```typescript
'use client';

import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Wallet } from 'lucide-react';

export function WalletBalanceDisplay() {
  const { balance, loading } = useWalletBalance();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (balance === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Wallet className="h-4 w-4" />
      <span className="text-sm font-medium">{balance.toFixed(4)} SOL</span>
    </div>
  );
}
```

## Landing Page with Wallet Connect

Create `src/app/page.tsx`:

```typescript
import { WalletButtonWithAuth } from '@/components/wallet/WalletButton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Plutor
        </h1>
        <p className="text-xl text-muted-foreground">
          Global on-chain invoicing protocol. Connect your wallet to get started.
        </p>
        <div className="flex justify-center">
          <WalletButtonWithAuth />
        </div>
        <div className="mt-12 grid grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Instant Payments</h3>
            <p className="text-muted-foreground">Pay invoices in seconds on Solana</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Low Fees</h3>
            <p className="text-muted-foreground">Only 2% platform fee</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Global Access</h3>
            <p className="text-muted-foreground">Decentralized identity system</p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

## Wallet Utilities

### Create Wallet Helper Functions

Create `src/lib/crypto/wallet.ts`:

```typescript
import { PublicKey } from '@solana/web3.js';

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function compareAddresses(address1: string, address2: string): boolean {
  try {
    const pubkey1 = new PublicKey(address1);
    const pubkey2 = new PublicKey(address2);
    return pubkey1.equals(pubkey2);
  } catch {
    return false;
  }
}
```

## Error Handling

### Create Wallet Error Component

Create `src/components/wallet/WalletError.tsx`:

```typescript
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { WalletError as SolanaWalletError } from '@solana/wallet-adapter-base';

interface WalletErrorProps {
  error: Error | SolanaWalletError;
  onRetry?: () => void;
}

export function WalletError({ error, onRetry }: WalletErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wallet Error</AlertTitle>
      <AlertDescription>
        {error.message}
        {onRetry && (
          <button onClick={onRetry} className="ml-2 underline">
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

## Testing Wallet Integration

### Manual Testing Checklist

1. **Connect Wallet**
    - [ ] Phantom wallet connects successfully
    - [ ] Solflare wallet connects successfully
    - [ ] Wallet address displays correctly
    - [ ] Balance fetches correctly

2. **User Flow**
    - [ ] New user redirects to onboarding
    - [ ] Existing user redirects to dashboard
    - [ ] Disconnect works properly

3. **Error Handling**
    - [ ] Wallet rejection handled gracefully
    - [ ] Network errors displayed properly
    - [ ] Invalid wallet addresses rejected

### Testing Script

Create `scripts/test-wallet.ts`:

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function testWalletConnection() {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    'confirmed'
  );

  console.log('Testing Solana connection...');

  // Test connection
  const version = await connection.getVersion();
  console.log('✓ Connected to Solana:', version);

  // Test wallet balance (replace with your test wallet)
  const testWallet = new PublicKey('YOUR_TEST_WALLET_ADDRESS');
  const balance = await connection.getBalance(testWallet);
  console.log(`✓ Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);

  console.log('All tests passed!');
}

testWalletConnection().catch(console.error);
```

## Next Steps

1. ✅ Wallet integration complete
2. → Proceed to `04-DID-SYSTEM.md` for DID creation
3. → Then implement onboarding flow

## Troubleshooting

### Common Issues

**Wallet not connecting:**
- Check if browser has wallet extension installed
- Verify network matches (devnet/mainnet)
- Check console for specific errors

**RPC errors:**
- Use a reliable RPC provider (Helius, QuickNode)
- Implement rate limiting
- Add retry logic

**Balance not updating:**
- Check connection status
- Verify wallet address is correct
- Confirm network is correct (devnet vs mainnet)