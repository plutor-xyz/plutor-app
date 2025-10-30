import { FileText, DollarSign, TrendingUp, Plus, ArrowUpRight, Clock, CheckCircle } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display-2 font-bold text-white">Dashboard</h1>
            <p className="text-plutor-navy-300 mt-1">
              Welcome back! Here's what's happening with your invoices.
            </p>
          </div>
          <Link href="/invoices/new">
            <Button variant="success" icon={<Plus className="w-4 h-4" />}>
              Create Invoice
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="wealth" glow>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-plutor-navy-300 text-sm font-medium">Total Value</p>
                  <p className="text-2xl font-bold text-white mt-1">$127,500</p>
                  <p className="text-plutor-gold text-sm mt-1 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-plutor-gold/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-plutor-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-plutor-navy-300 text-sm font-medium">Total Invoices</p>
                  <p className="text-2xl font-bold text-white mt-1">24</p>
                  <p className="text-plutor-green text-sm mt-1 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +3 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-plutor-purple/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-plutor-purple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-plutor-navy-300 text-sm font-medium">Pending Amount</p>
                  <p className="text-2xl font-bold text-white mt-1">$45,200</p>
                  <p className="text-plutor-navy-400 text-sm mt-1">12 invoices</p>
                </div>
                <div className="w-12 h-12 bg-plutor-blue/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-plutor-blue" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-plutor-navy-300 text-sm font-medium">Trust Score</p>
                  <p className="text-2xl font-bold text-plutor-gold mt-1">87/100</p>
                  <p className="text-plutor-green text-sm mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Excellent rating
                  </p>
                </div>
                <div className="w-12 h-12 bg-plutor-green/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-plutor-green" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-plutor-navy-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-plutor-purple/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-plutor-purple" />
                    </div>
                    <div>
                      <p className="text-white font-medium">INV-001</p>
                      <p className="text-plutor-navy-400 text-sm">Client: Acme Corp</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">$5,000</p>
                    <p className="text-plutor-gold text-sm">Due in 30 days</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-plutor-navy-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-plutor-purple/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-plutor-purple" />
                    </div>
                    <div>
                      <p className="text-white font-medium">INV-002</p>
                      <p className="text-plutor-navy-400 text-sm">Client: TechStart Ltd</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">$3,200</p>
                    <p className="text-plutor-gold text-sm">Due in 15 days</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-plutor-navy-800 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-plutor-green/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-plutor-green" />
                    </div>
                    <div>
                      <p className="text-white font-medium">INV-003</p>
                      <p className="text-plutor-navy-400 text-sm">Client: Global Inc</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">$8,500</p>
                    <p className="text-plutor-green text-sm">Funded ✓</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-plutor-navy-600">
                <Link href="/invoices">
                  <Button variant="ghost" className="w-full">
                    View All Invoices
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/invoices/new">
                  <Button variant="primary" className="w-full justify-start" icon={<Plus className="w-4 h-4" />}>
                    Create New Invoice
                  </Button>
                </Link>
                
                <Link href="/financing">
                  <Button variant="success" className="w-full justify-start" icon={<DollarSign className="w-4 h-4" />}>
                    Request Financing
                  </Button>
                </Link>
                
                <Link href="/identity">
                  <Button variant="secondary" className="w-full justify-start" icon={<TrendingUp className="w-4 h-4" />}>
                    Improve Trust Score
                  </Button>
                </Link>
              </div>

              <div className="mt-6 p-4 bg-cosmic rounded-xl">
                <h4 className="text-white font-semibold mb-2">💡 Pro Tip</h4>
                <p className="text-plutor-navy-300 text-sm">
                  Verify your business identity to unlock higher advance rates and better financing terms.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}