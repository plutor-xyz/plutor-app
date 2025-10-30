export default function FinancingPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Financing Marketplace</h1>
      <div className="bg-plutor-navy-light border border-plutor-navy-600 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Available Offers</h3>
        <p className="text-plutor-navy-300">No financing offers available. Create and submit invoices to receive offers.</p>
      </div>
      <div className="bg-plutor-navy-light border border-plutor-navy-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Financing History</h3>
        <p className="text-plutor-navy-300">No financing history yet.</p>
      </div>
    </div>
  )
}