'use client';

export function MarketInsightsTab() {
  console.log('MarketInsightsTab rendered');
  // Lightweight mock data - in production, this would come from your API
  const insights = [
    {
      title: "Average Business Value",
      value: "$125,000",
      change: "+12%",
      changeType: "positive",
      description: "Up from last quarter"
    },
    {
      title: "Time to Sell",
      value: "4.2 months",
      change: "-8%",
      changeType: "positive",
      description: "Faster than national average"
    },
    {
      title: "Active Listings",
      value: "247",
      change: "+15%",
      changeType: "positive",
      description: "More opportunities available"
    },
    {
      title: "Success Rate",
      value: "78%",
      change: "+5%",
      changeType: "positive",
      description: "Businesses that sell successfully"
    }
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            OKC Business Market Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time market data and trends for Oklahoma City businesses. 
            Make informed decisions with AI-powered insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <h3 className="text-sm font-medium text-gray-600 mb-2">{insight.title}</h3>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                <span className={`text-sm font-medium ${
                  insight.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {insight.change}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{insight.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Market Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-800">Restaurant Industry Booming</h4>
                <p className="text-sm text-green-600">Average values up 18% this quarter</p>
              </div>
              <span className="text-green-600 font-bold">+18%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-800">Service Businesses in Demand</h4>
                <p className="text-sm text-blue-600">Faster sales, higher prices</p>
              </div>
              <span className="text-blue-600 font-bold">+12%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-purple-800">Tech Startups Growing</h4>
                <p className="text-sm text-purple-600">New category emerging in OKC</p>
              </div>
              <span className="text-purple-600 font-bold">+25%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
