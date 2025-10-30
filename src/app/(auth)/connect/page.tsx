'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useWallet } from '@/hooks/use-wallet'
import Button from '@/components/ui/button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConnectPage() {
  const { connected, connectSolflare, disconnect, publicKey } = useWallet()

  const formatWalletAddress = (publicKey: any) => {
    if (!publicKey) return ''
    const address = publicKey.toString()
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  if (connected && publicKey) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-plutor-green">Wallet Connected</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-plutor-green/10 rounded-lg border border-plutor-green/30">
                <p className="text-sm text-gray-300 mb-2">Connected Address</p>
                <p className="font-mono text-plutor-green">{formatWalletAddress(publicKey)}</p>
              </div>
              
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  onClick={disconnect}
                  className="w-full"
                >
                  Disconnect Wallet
                </Button>
              </div>
              
              <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-plutor-green transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-plutor-green">Connect Your Wallet</CardTitle>
            <p className="text-gray-300">Connect your Solana wallet to start using Plutor</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={connectSolflare}
                className="w-full"
              >
                Connect Solflare Wallet
              </Button>
              
              <p className="text-xs text-gray-400">
                By connecting your wallet, you agree to our terms of service
              </p>
            </div>
            
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-plutor-green transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}