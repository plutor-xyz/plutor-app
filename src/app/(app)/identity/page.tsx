import { User, Shield, CheckCircle } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import PageContainer from '@/components/layout/page-container'
import PageHeader from '@/components/layout/page-header'

export default function IdentityPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Digital Identity"
        description="Manage your decentralized identity and trust score"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-plutor-green" />
              DID Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'DID Created', status: '✓', color: 'text-plutor-green' },
                { label: 'Business Verified', status: 'Pending', color: 'text-plutor-green-bright' },
                { label: 'Credit Score', status: 'Not Available', color: 'text-gray-400' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-300">{item.label}</span>
                  <span className={item.color}>{item.status}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button variant="primary" className="w-full">
                Verify Business
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-plutor-green" />
              Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-plutor-green mb-2">87</div>
              <p className="text-gray-300 mb-4">Based on your transaction history</p>
              
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Payment History</span>
                  <span className="text-plutor-green">95%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Identity Verified</span>
                  <span className="text-plutor-green">✓</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Business Age</span>
                  <span className="text-white">2+ years</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-plutor-green" />
              Verification Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { step: 'Connect Wallet', completed: true },
                { step: 'Verify Email', completed: true },
                { step: 'Business Documents', completed: false },
                { step: 'Tax ID Verification', completed: false }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    item.completed 
                      ? 'bg-plutor-green text-plutor-green-dark' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {item.completed ? '✓' : index + 1}
                  </div>
                  <span className={item.completed ? 'text-white' : 'text-gray-400'}>
                    {item.step}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}