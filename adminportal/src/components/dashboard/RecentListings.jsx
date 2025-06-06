const RecentListings = ({ listings = [] }) => {
  if (!listings || listings.length === 0) {
    return (
      <div className="dashboard-card h-full">
        <h3 className="text-lg font-medium mb-4">Recent Listings</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">No recent listings available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card h-full">
      <h3 className="text-lg font-medium mb-4">Recent Listings</h3>
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {listings.map((listing) => (
            <li key={listing.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{listing.type}</span>
                    <span className="mx-1 text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{listing.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">${listing.price}/mo</p>
                  <p className={`text-xs mt-1 ${
                    listing.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                  }`}>{listing.status}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center">
        <a href="/listings" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
          View all listings
        </a>
      </div>
    </div>
  );
};

export default RecentListings;