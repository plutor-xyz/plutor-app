import { Plus } from 'lucide-react'
import Button from '@/components/ui/button'

export default function CreateInvoicePage() {
  return (
    <div className="p-6 min-h-screen bg-black">
      <h1 className="text-2xl font-bold mb-6 text-white">Create New Invoice</h1>
      <div className="bg-background-card border border-plutor-green/20 rounded-lg shadow p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              className="w-full border border-plutor-green/20 bg-background-light text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Client Name
            </label>
            <input
              type="text"
              className="w-full border border-plutor-green/20 bg-background-light text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
              placeholder="Client Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              className="w-full border border-plutor-green/20 bg-background-light text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              className="w-full border border-plutor-green/20 bg-background-light text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
            />
          </div>
          <Button
            type="submit"
            variant="success"
            icon={<Plus className="w-4 h-4" />}
          >
            Create Invoice
          </Button>
        </form>
      </div>
    </div>
  )
}
