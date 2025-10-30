import { clusterApiUrl } from '@solana/web3.js'

export type SolanaNetwork = 'mainnet-beta' | 'testnet' | 'devnet'

export const solanaConfig = {
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || 'devnet',
  rpcEndpoint: process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl('devnet'),
  wsEndpoint: process.env.NEXT_PUBLIC_WS_ENDPOINT,
  commitment: 'confirmed' as const,
  
  // Program IDs
  programs: {
    tips: process.env.NEXT_PUBLIC_TIPS_PROGRAM_ID || '',
    invoice: process.env.NEXT_PUBLIC_INVOICE_PROGRAM_ID || '',
    financing: process.env.NEXT_PUBLIC_FINANCING_PROGRAM_ID || '',
  },
  
  // Token addresses
  tokens: {
    usdc: {
      mainnet: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      devnet: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    },
    usdt: {
      mainnet: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      devnet: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS',
    },
  },
  
  // Transaction settings
  transaction: {
    maxRetries: 3,
    confirmationTimeout: 30000, // 30 seconds
    skipPreflight: false,
  },
}

export type SolanaConfig = typeof solanaConfig