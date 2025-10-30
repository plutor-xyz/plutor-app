export default function CreateInvoicePage() {
  return (
    <div className="p-6 min-h-screen bg-plutor-navy">
      <h1 className="text-2xl font-bold mb-6 text-white">Create New Invoice</h1>
      <div className="bg-plutor-navy-800 border border-plutor-navy-600 rounded-lg shadow p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-plutor-navy-200 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              className="w-full border border-plutor-navy-600 bg-plutor-navy-700 text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-plutor-navy-200 mb-1">
              Client Name
            </label>
            <input
              type="text"
              className="w-full border border-plutor-navy-600 bg-plutor-navy-700 text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
              placeholder="Client Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-plutor-navy-200 mb-1">
              Amount
            </label>
            <input
              type="number"
              className="w-full border border-plutor-navy-600 bg-plutor-navy-700 text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-plutor-navy-200 mb-1">
              Due Date
            </label>
            <input
              type="date"
              className="w-full border border-plutor-navy-600 bg-plutor-navy-700 text-white rounded-md px-3 py-2 focus:border-plutor-green focus:ring-1 focus:ring-plutor-green"
            />
          </div>
          <button
            type="submit"
            className="bg-plutor-green text-white px-4 py-2 rounded hover:bg-plutor-green-600 transition-colors"
          >
            Create Invoice
          </button>
        </form>
      </div>
    </div>
  )
}