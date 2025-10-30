'use client'

import { Save, User, Bell, Shield, Wallet } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import { useState } from 'react'
import { useWallet } from '@/hooks/use-wallet'
import PageContainer from '@/components/layout/page-container'
import PageHeader from '@/components/layout/page-header'

export default function SettingsPage() {
  const { publicKey, connected } = useWallet()
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  })

  const formatWalletAddress = (publicKey: any) => {
    if (!publicKey) return ''
    const address = publicKey.toString()
    return `${address.slice(0, 12)}...${address.slice(-12)}`
  }

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your account preferences and security settings"
        action={
          <Button variant="success" icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Acme Corporation"
                    className="input"
                    placeholder="Enter business name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@acme.com"
                    className="input"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    defaultValue="123 Main St, City, State"
                    className="input"
                    placeholder="Enter business address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    defaultValue="XX-XXXXXXX"
                    className="input"
                    placeholder="Enter tax ID"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email notifications for invoice updates' },
                  { key: 'push', label: 'Push notifications for payments' },
                  { key: 'sms', label: 'SMS alerts for urgent updates' }
                ].map((option) => (
                  <label key={option.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notifications[option.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({...notifications, [option.key]: e.target.checked})}
                      className="rounded border-gray-300 text-plutor-green focus:ring-plutor-green mr-3"
                    />
                    <span className="text-white">{option.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { title: 'Two-Factor Authentication', description: 'Add an extra layer of security', action: 'Enable' },
                  { title: 'Session Timeout', description: 'Automatically log out after 30 minutes', action: 'Configure' }
                ].map((setting) => (
                  <div key={setting.title} className="flex items-center justify-between p-3 bg-background-light rounded-lg">
                    <div>
                      <p className="text-white font-medium">{setting.title}</p>
                      <p className="text-gray-400 text-sm">{setting.description}</p>
                    </div>
                    <Button variant="secondary" size="sm">{setting.action}</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Wallet Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              {connected && publicKey ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Connected Address</p>
                    <p className="font-mono text-plutor-green text-sm">{formatWalletAddress(publicKey)}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Network</p>
                    <p className="text-white">Solana Mainnet</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Wallet Type</p>
                    <p className="text-white">Solflare</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No wallet connected</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-plutor-green mb-2">87/100</div>
                <p className="text-gray-400 text-sm mb-4">Excellent Rating</p>
                
                <div className="space-y-2 text-left">
                  {[
                    { label: 'Payment History', value: '95%', color: 'text-plutor-green' },
                    { label: 'Identity Verified', value: '✓', color: 'text-plutor-green' },
                    { label: 'Business Age', value: '2+ years', color: 'text-white' }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={item.color}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}