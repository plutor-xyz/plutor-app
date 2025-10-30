'use client'

import React, { ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'

export function CustomWalletModalProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function CustomWalletButton() {
  const { wallets, select, connected, disconnect, connecting } = useWallet()
  
  // Filter to only show Solflare
  const solflareWallet = wallets.find(wallet => wallet.adapter.name === 'Solflare')
  
  const handleConnect = () => {
    if (solflareWallet) {
      select(solflareWallet.adapter.name as WalletName)
    }
  }
  
  if (connected) {
    return (
      <button 
        onClick={disconnect}
        className="!bg-red-600 hover:!bg-red-700 !text-white !border-none !rounded-lg !px-6 !py-3 !font-medium !transition-colors"
      >
        Disconnect
      </button>
    )
  }
  
  if (connecting) {
    return (
      <button 
        disabled
        className="!bg-plutor-purple/50 !text-white !border-none !rounded-lg !px-6 !py-3 !font-medium"
      >
        Connecting...
      </button>
    )
  }
  
  return (
    <button 
      onClick={handleConnect}
      className="!bg-plutor-purple hover:!bg-purple-600 !text-white !border-none !rounded-lg !px-6 !py-3 !font-medium !transition-colors"
    >
      Connect Solflare Wallet
    </button>
  )
}