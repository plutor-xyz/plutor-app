'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork, WalletReadyState } from '@solana/wallet-adapter-base'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { CustomWalletModalProvider } from './custom-wallet-modal'
import { clusterApiUrl } from '@solana/web3.js'
import { solanaConfig } from '@/config/solana'

require('@solana/wallet-adapter-react-ui/styles.css')

interface WalletContextProviderProps {
  children: React.ReactNode
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  const network = solanaConfig.network === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => {
    return solanaConfig.rpcEndpoint || clusterApiUrl(network)
  }, [network])

  const wallets = useMemo(() => [
    new SolflareWalletAdapter({ network })
  ], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect 
        onError={() => {}}
        localStorageKey="plutor-wallet"
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}