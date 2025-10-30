export default function IdentityPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Digital Identity</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-plutor-navy-light border border-plutor-navy-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">DID Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-plutor-navy-300">DID Created</span>
              <span className="text-plutor-green">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-plutor-navy-300">Business Verified</span>
              <span className="text-plutor-gold">Pending</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-plutor-navy-300">Credit Score</span>
              <span className="text-plutor-navy-400">Not Available</span>
            </div>
          </div>
        </div>
        <div className="bg-plutor-navy-light border border-plutor-navy-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Trust Score</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-plutor-gold mb-2">87</div>
            <p className="text-plutor-navy-300">Based on your transaction history</p>
          </div>
        </div>
      </div>
    </div>
  )
}