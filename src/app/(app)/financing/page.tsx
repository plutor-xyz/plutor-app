import { DollarSign, TrendingUp } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PageContainer from '@/components/layout/page-container'
import PageHeader from '@/components/layout/page-header'
import EmptyState from '@/components/ui/empty-state'

export default function FinancingPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Financing Marketplace"
        description="Access instant liquidity for your invoices"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-plutor-green" />
              Available Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No offers available"
              description="Create and submit invoices to receive financing offers from our network of funders."
              icon={<DollarSign className="w-6 h-6 text-plutor-green" />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-plutor-green" />
              Financing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="No history yet"
              description="Your financing transactions will appear here once you start using our platform."
              icon={<TrendingUp className="w-6 h-6 text-plutor-green" />}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}