export default function InvoicesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <a 
          href="/invoices/new" 
          className="bg-plutor-purple text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
        >
          Create Invoice
        </a>
      </div>
      <div className="bg-plutor-navy-light border border-plutor-navy-600 rounded-lg">
        <div className="p-6">
          <p className="text-plutor-navy-300 text-center">No invoices yet. Create your first invoice to get started.</p>
        </div>
      </div>
    </div>
  )
}