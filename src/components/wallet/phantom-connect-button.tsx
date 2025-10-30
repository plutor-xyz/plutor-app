'use client'

import { useWallet } from '@/hooks/use-wallet'
import Button from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function PhantomConnectButton() {
  const { wallet, connect, connected, connecting, disconnect, publicKey, select } = useWallet()

  const handleConnect = async () => {
    try {
      // Select Phantom wallet
      select('Phantom' as any)
      await connect()
    } catch (error) {
      console.error('Failed to connect to Phantom:', error)
      // If Phantom is not installed, redirect to download
      if (error?.message?.includes('not found') || error?.message?.includes('not installed')) {
        window.open('https://phantom.app/download', '_blank')
      }
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
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
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
      <Button disabled className="!bg-plutor-green/50 !text-black !border-none !rounded-lg !px-8 !py-4 !font-medium">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Connecting...</span>
        </div>
      </Button>
    )
  }

  return (
    <Button 
      onClick={handleConnect}
      className="!bg-plutor-green hover:!bg-plutor-green/80 !text-black !border-none !rounded-lg !px-8 !py-4 !font-medium !transition-colors !text-lg"
    >
      <div className="flex items-center space-x-3">
        <Wallet className="w-5 h-5" />
        <span>Connect Phantom Wallet</span>
      </div>
    </Button>
  )
}

