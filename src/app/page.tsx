'use client'

import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  ExternalLink,
} from 'lucide-react'
import Button from '@/components/ui/button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useWallet } from '@/hooks/use-wallet'
import { HeroSection } from '@/components/landing/HeroSection'

export default function Home() {
  const { connected, publicKey } = useWallet()

  const formatWalletAddress = (publicKey: any) => {
    if (!publicKey) return ''
    const address = publicKey.toString()
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }
  return (
    <main className="relative">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src="/icons/plutor-svg-logo.svg"
                    alt="Plutor"
                    className="w-10 h-10"
                  />
                </div>
                <span className="text-sm font-medium text-gray-400">Beta</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-[#A0E66E] hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-[#A0E66E] hover:text-white transition-colors"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                className="text-[#A0E66E] hover:text-white transition-colors"
              >
                Pricing
              </a>
              {connected && publicKey ? (
                <div className="px-3 py-2 bg-black/50 rounded-lg border border-[#A0E66E]/30">
                  <span className="text-sm font-mono text-[#A0E66E]">
                    {formatWalletAddress(publicKey)}
                  </span>
                </div>
              ) : (
                <Link href="/connect">
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-[#143200] bg-[#A0E66E] hover:bg-opacity-80"
                  >
                    Connect Wallet
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof */}
      <section className="py-16 bg-plutor-green/5 border-y border-plutor-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-body text-gray-300 mb-8">
            Trusted by businesses creating wealth globally
          </p>
          <div className="flex items-center justify-center space-x-12 opacity-50">
            {/* Placeholder for partner logos */}
            <div className="w-24 h-8 bg-plutor-green/20 rounded" />
            <div className="w-24 h-8 bg-plutor-green/20 rounded" />
            <div className="w-24 h-8 bg-plutor-green/20 rounded" />
            <div className="w-24 h-8 bg-plutor-green/20 rounded" />
            <div className="w-24 h-8 bg-plutor-green/20 rounded" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display-1 font-bold text-plutor-green mb-4">
              How It Works
            </h2>
            <p className="text-body-lg text-gray-300 max-w-2xl mx-auto">
              Three simple steps to transform your invoices into instant wealth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-plutor-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-plutor-green-dark">
                    1
                  </span>
                </div>
                <CardTitle size="md" className="mb-4 text-plutor-green">
                  Issue Invoice
                </CardTitle>
                <p className="text-gray-300">
                  Create your invoice and mint it as an NFT on Solana using TIPS
                  Protocol
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-plutor-green-bright rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-black">2</span>
                </div>
                <CardTitle size="md" className="mb-4 text-plutor-green">
                  Get Funded
                </CardTitle>
                <p className="text-gray-300">
                  Receive instant USDC liquidity based on your invoice value and
                  trust score
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-plutor-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-plutor-green-dark">
                    3
                  </span>
                </div>
                <CardTitle size="md" className="mb-4 text-plutor-green">
                  Client Pays
                </CardTitle>
                <p className="text-gray-300">
                  When your client pays, the system automatically settles the
                  financing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-plutor-green/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-display-2 font-bold text-plutor-green mb-6">
                Instant Liquidity
              </h3>
              <p className="text-body-lg text-gray-300 mb-8">
                Don't wait 30-90 days for payment. Get funded in seconds with
                competitive rates based on your business reputation and invoice
                quality.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-plutor-green" />
                  <span className="text-white">Instant USDC funding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-plutor-green" />
                  <span className="text-white">Competitive rates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-plutor-green" />
                  <span className="text-white">No hidden fees</span>
                </div>
              </div>
            </div>
            <div className="bg-background-card rounded-2xl p-8 border border-plutor-green/30">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Invoice Amount</span>
                  <span className="text-white font-mono">$10,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Advance Rate</span>
                  <span className="text-plutor-green-bright font-mono">
                    85%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">You Receive</span>
                  <span className="text-plutor-green-bright font-mono font-bold">
                    $8,500 USDC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cosmic-green-animated animate-gradient-shift">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-display-1 font-bold text-plutor-green mb-6">
            Ready to Create Wealth?
          </h2>
          <p className="text-body-lg text-gray-300 mb-8">
            Join thousands of businesses using Plutor to unlock instant
            liquidity from their invoices
          </p>
          <Link href="/connect">
            <Button
              variant="success"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="bg-plutor-green text-plutor-green-dark hover:bg-plutor-green/80"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-card border-t border-plutor-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img
                    src="/icons/plutor-svg-logo.svg"
                    alt="Plutor"
                    className="w-10 h-10"
                  />
                </div>
                <span className="text-xl font-bold text-plutor-green">
                  Plutor
                </span>
              </div>
              <p className="text-gray-300 max-w-md">
                Decentralized invoice finance platform powered by Solana and
                TIPS Protocol. Create wealth from your invoices.
              </p>
            </div>

            <div>
              <h4 className="text-plutor-green font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block text-gray-300 hover:text-plutor-green transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/invoices"
                  className="block text-gray-300 hover:text-plutor-green transition-colors"
                >
                  Invoices
                </Link>
                <Link
                  href="/financing"
                  className="block text-gray-300 hover:text-plutor-green transition-colors"
                >
                  Financing
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-plutor-green font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-gray-300 hover:text-plutor-green transition-colors"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-plutor-green transition-colors"
                >
                  Help Center
                </a>
                <a
                  href="#"
                  className="block text-gray-300 hover:text-plutor-green transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-plutor-green/20 text-center">
            <p className="text-gray-500">
              © 2025 Plutor. All rights reserved. Built on TIPS Protocol
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
