import { FileText, DollarSign, TrendingUp, Plus, ArrowUpRight, Clock } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Link from 'next/link'
import PageContainer from '@/components/layout/page-container'
import PageHeader from '@/components/layout/page-header'
import StatCard from '@/components/ui/stat-card'

export default function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your invoices."
        action={
          <Link href="/invoices/new">
            <Button variant="success" icon={<Plus className="w-4 h-4" />}>
              Create Invoice
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Value"
          value="$127,500"
          change="+12.5% from last month"
          changeType="positive"
          icon={<DollarSign className="w-6 h-6 text-plutor-green" />}
          variant="wealth"
        />
        
        <StatCard
          title="Total Invoices"
          value="24"
          change="+3 this week"
          changeType="positive"
          icon={<FileText className="w-6 h-6 text-plutor-green" />}
        />
        
        <StatCard
          title="Pending Amount"
          value="$45,200"
          change="12 invoices"
          changeType="neutral"
          icon={<Clock className="w-6 h-6 text-plutor-green" />}
        />
        
        <StatCard
          title="Trust Score"
          value="87/100"
          change="Excellent rating"
          changeType="positive"
          icon={<TrendingUp className="w-6 h-6 text-plutor-green" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'INV-001', client: 'Acme Corp', amount: '$5,000', status: 'Due in 30 days', statusColor: 'text-plutor-green-bright' },
                { id: 'INV-002', client: 'TechStart Ltd', amount: '$3,200', status: 'Due in 15 days', statusColor: 'text-plutor-green-bright' },
                { id: 'INV-003', client: 'Global Inc', amount: '$8,500', status: 'Funded ✓', statusColor: 'text-plutor-green' }
              ].map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-background-light rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-plutor-green/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-plutor-green" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{invoice.id}</p>
                      <p className="text-gray-400 text-sm">Client: {invoice.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">{invoice.amount}</p>
                    <p className={`text-sm ${invoice.statusColor}`}>{invoice.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-plutor-green/20">
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
            <div className="space-y-4">
              <div>
                <Link href="/invoices/new">
                  <Button variant="primary" className="w-full justify-start" icon={<Plus className="w-4 h-4" />}>
                    Create New Invoice
                  </Button>
                </Link>
              </div>
              
              <div>
                <Link href="/financing">
                  <Button variant="success" className="w-full justify-start" icon={<DollarSign className="w-4 h-4" />}>
                    Request Financing
                  </Button>
                </Link>
              </div>
              
              <div>
                <Link href="/identity">
                  <Button variant="secondary" className="w-full justify-start" icon={<TrendingUp className="w-4 h-4" />}>
                    Improve Trust Score
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-plutor-green/5 rounded-xl border border-plutor-green/20">
              <h4 className="text-white font-semibold mb-2">💡 Pro Tip</h4>
              <p className="text-gray-300 text-sm">
                Verify your business identity to unlock higher advance rates and better financing terms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}