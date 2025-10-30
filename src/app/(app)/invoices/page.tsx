import { Plus, FileText } from 'lucide-react'
import Button from '@/components/ui/button'
import Link from 'next/link'
import PageContainer from '@/components/layout/page-container'
import PageHeader from '@/components/layout/page-header'
import EmptyState from '@/components/ui/empty-state'

export default function InvoicesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Invoices"
        description="Manage your invoices and track payments"
        action={
          <Link href="/invoices/new">
            <Button variant="success" icon={<Plus className="w-4 h-4" />}>
              Create Invoice
            </Button>
          </Link>
        }
      />

      <EmptyState
        title="No invoices yet"
        description="Create your first invoice to get started with Plutor's invoice financing platform."
        icon={<FileText className="w-8 h-8 text-plutor-green" />}
        action={
          <Link href="/invoices/new">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create Your First Invoice
            </Button>
          </Link>
        }
      />
    </PageContainer>
  )
}