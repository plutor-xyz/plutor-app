interface InvoiceDetailPageProps {
  params: {
    id: string
  }
}

export default function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Invoice #{params.id}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Invoice Number:</span> INV-
                {params.id}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-yellow-600">Pending</span>
              </p>
              <p>
                <span className="font-medium">Amount:</span> $1,000.00
              </p>
              <p>
                <span className="font-medium">Due Date:</span> 2026-01-15
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Send Invoice
              </button>
              <button className="block w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Request Financing
              </button>
              <button className="block w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
