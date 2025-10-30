'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { Wallet } from 'lucide-react'
import Button from '@/components/ui/button'

export function WalletSelector() {
  const { wallets, select, connected, disconnect, connecting, publicKey } =
    useWallet()

  const phantomWallet = wallets.find(
    (wallet) => wallet.adapter.name === 'Phantom'
  )
  const solflareWallet = wallets.find(
    (wallet) => wallet.adapter.name === 'Solflare'
  )

  const handleConnect = async (walletName: WalletName) => {
    try {
      select(walletName)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  if (connected && publicKey) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2 bg-black/50 rounded-lg px-4 py-3 border border-plutor-green/30">
          <div className="w-2 h-2 bg-plutor-green rounded-full" />
          <span className="text-plutor-green font-mono text-sm">
            {publicKey.toString().slice(0, 4)}...
            {publicKey.toString().slice(-4)}
          </span>
        </div>
        <Button variant="secondary" onClick={handleDisconnect} size="sm">
          Disconnect
        </Button>
      </div>
    )
  }

  if (connecting) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Connecting...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {phantomWallet && (
        <button
          onClick={() =>
            handleConnect(phantomWallet.adapter.name as WalletName)
          }
          disabled={
            phantomWallet.readyState !== WalletReadyState.Installed &&
            phantomWallet.readyState !== WalletReadyState.Loadable
          }
          className="flex items-center justify-between p-4 bg-black/50 hover:bg-black/70 border border-plutor-green/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-plutor-green to-plutor-green-bright rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Phantom</p>
              <p className="text-sm text-gray-400">
                {phantomWallet.readyState === WalletReadyState.Installed ||
                phantomWallet.readyState === WalletReadyState.Loadable
                  ? 'Detected'
                  : 'Not installed'}
              </p>
            </div>
          </div>
          <div className="text-plutor-green group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>
      )}

      {solflareWallet && (
        <button
          onClick={() =>
            handleConnect(solflareWallet.adapter.name as WalletName)
          }
          disabled={
            solflareWallet.readyState !== WalletReadyState.Installed &&
            solflareWallet.readyState !== WalletReadyState.Loadable
          }
          className="flex items-center justify-between p-4 bg-black/50 hover:bg-black/70 border border-plutor-green/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-plutor-green to-plutor-green-bright rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Solflare</p>
              <p className="text-sm text-gray-400">
                {solflareWallet.readyState === WalletReadyState.Installed ||
                solflareWallet.readyState === WalletReadyState.Loadable
                  ? 'Detected'
                  : 'Not installed'}
              </p>
            </div>
          </div>
          <div className="text-plutor-green group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>
      )}

      <p className="text-xs text-gray-500 text-center mt-2">
        Don't have a wallet?{' '}
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-plutor-green hover:underline"
        >
          Get Phantom
        </a>
        {' or '}
        <a
          href="https://solflare.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-plutor-green hover:underline"
        >
          Get Solflare
        </a>
      </p>
    </div>
  )
}
