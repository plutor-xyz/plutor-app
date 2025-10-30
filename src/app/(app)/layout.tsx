'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useWallet } from '@/hooks/use-wallet'
import Button from '@/components/ui/button'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { connected, disconnect, publicKey } = useWallet()

  const formatWalletAddress = (publicKey: any) => {
    if (!publicKey) return ''
    const address = publicKey.toString()
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-plutor-green mb-4">Wallet Not Connected</h1>
          <p className="text-gray-300 mb-6">Please connect your wallet to access the dashboard</p>
          <Link href="/connect">
            <Button variant="primary">Connect Wallet</Button>
          </Link>
        </div>
      </div>
    )
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Financing', href: '/financing', icon: DollarSign },
    { name: 'Identity', href: '/identity', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background-card border-r border-plutor-green/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-plutor-green/20">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src="/icons/plutor-svg-logo.svg" alt="Plutor" className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold text-plutor-green">Plutor</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-plutor-green/20">
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
              <p className="font-mono text-sm text-plutor-green">{formatWalletAddress(publicKey)}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={disconnect}
              className="w-full justify-start text-gray-400 hover:text-white"
              icon={<LogOut className="w-4 h-4" />}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-background-card/95 backdrop-blur-sm border-b border-plutor-green/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden lg:block" />
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}