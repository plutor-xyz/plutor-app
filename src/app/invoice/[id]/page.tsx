interface PublicInvoicePageProps {
  params: {
    id: string
  }
}

export default function PublicInvoicePage({ params }: PublicInvoicePageProps) {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <p className="text-gray-600">Invoice #{params.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">From</h3>
              <div className="text-gray-600">
                <p>Your Business Name</p>
                <p>123 Business St</p>
                <p>City, State 12345</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">To</h3>
              <div className="text-gray-600">
                <p>Client Name</p>
                <p>456 Client Ave</p>
                <p>City, State 67890</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold">$1,000.00</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span>Due Date</span>
              <span>January 15, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Status</span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Pending
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Pay Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
