'use client';

export function RecentlySoldTab() {
  console.log('RecentlySoldTab rendered');
  // Lightweight mock data - in production, this would come from your API
  const soldBusinesses = [
    {
      id: 1,
      name: "Downtown Coffee Shop",
      address: "123 Main St, Oklahoma City, OK",
      soldPrice: "$125,000",
      soldDate: "2 weeks ago",
      industry: "Restaurant",
      revenue: "$180K/year"
    },
    {
      id: 2,
      name: "Auto Repair Shop",
      address: "456 Auto Way, Oklahoma City, OK",
      soldPrice: "$85,000",
      soldDate: "1 month ago",
      industry: "Automotive",
      revenue: "$120K/year"
    },
    {
      id: 3,
      name: "Beauty Salon",
      address: "789 Beauty Blvd, Oklahoma City, OK",
      soldPrice: "$65,000",
      soldDate: "6 weeks ago",
      industry: "Beauty",
      revenue: "$95K/year"
    }
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recently Sold Businesses in OKC
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what businesses are actually selling for in Oklahoma City. 
            Real data from recent transactions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  SOLD
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">{business.address}</p>
              <p className="text-sm text-gray-500 mb-4">{business.industry}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sold Price:</span>
                  <span className="text-sm font-semibold text-green-600">{business.soldPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue:</span>
                  <span className="text-sm text-gray-900">{business.revenue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sold Date:</span>
                  <span className="text-sm text-gray-900">{business.soldDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            View All Sold Businesses
          </button>
        </div>
      </div>
    </div>
  );
}
