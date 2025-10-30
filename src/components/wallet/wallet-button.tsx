'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@/hooks/use-wallet'
import Button from '@/components/ui/button'

export function WalletButton() {
  return (
    <WalletMultiButton className="!bg-plutor-purple hover:!bg-purple-600 !text-white !border-none !rounded-lg !px-6 !py-3 !font-medium !transition-colors" />
  )
}

export function WalletDisconnectButton() {
  const { disconnect, connected } = useWallet()

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  if (!connected) return null

  return (
    <Button variant="secondary" onClick={handleDisconnect} size="sm">
      Disconnect
    </Button>
  )
}

export function WalletStatus() {
  const { publicKey, connected, connecting } = useWallet()

  if (connecting) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        <span>Connecting...</span>
      </div>
    )
  }

  if (!connected || !publicKey) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="h-2 w-2 bg-green-500 rounded-full" />
      <span className="font-mono text-sm">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </span>
    </div>
  )
}
