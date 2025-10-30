'use client'

import React, { ReactNode, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { Wallet } from 'lucide-react'
import Button from '@/components/ui/button'

export function CustomWalletModalProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function CustomWalletButton() {
  const { wallets, select, connected, disconnect, connecting } = useWallet()
  
  // Filter to show both Phantom and Solflare
  const phantomWallet = wallets.find(wallet => wallet.adapter.name === 'Phantom')
  const solflareWallet = wallets.find(wallet => wallet.adapter.name === 'Solflare')
  
  const handleConnect = (walletName: WalletName) => {
    select(walletName)
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
        className="!bg-plutor-green/50 !text-black !border-none !rounded-lg !px-6 !py-3 !font-medium"
      >
        Connecting...
      </button>
    )
  }
  
  return (
    <div className="flex flex-col space-y-3">
      {phantomWallet && (
        <button 
          onClick={() => handleConnect(phantomWallet.adapter.name as WalletName)}
          className="!bg-plutor-green hover:!bg-plutor-green/80 !text-black !border-none !rounded-lg !px-6 !py-3 !font-medium !transition-colors"
        >
          Connect Phantom Wallet
        </button>
      )}
      {solflareWallet && (
        <button 
          onClick={() => handleConnect(solflareWallet.adapter.name as WalletName)}
          className="!bg-plutor-green hover:!bg-plutor-green/80 !text-black !border-none !rounded-lg !px-6 !py-3 !font-medium !transition-colors"
        >
          Connect Solflare Wallet
        </button>
      )}
    </div>
  )
}