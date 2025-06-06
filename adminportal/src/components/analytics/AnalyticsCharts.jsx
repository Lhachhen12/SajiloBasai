import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiUsers, FiMapPin, FiHome, FiMonitor, FiSmartphone, FiTablet } from 'react-icons/fi';

const DeviceStats = ({ data }) => {
  return (
    <div className="dashboard-card">
      <h3 className="text-base font-medium mb-4">Traffic by Device</h3>
      <div className="flex flex-col space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <FiSmartphone className="mr-2 text-primary-600" />
              <span className="text-sm font-medium">Mobile</span>
            </div>
            <span className="text-sm font-medium">{data.mobile}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${data.mobile}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <FiMonitor className="mr-2 text-secondary-600" />
              <span className="text-sm font-medium">Desktop</span>
            </div>
            <span className="text-sm font-medium">{data.desktop}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-secondary-600 h-2 rounded-full" style={{ width: `${data.desktop}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <FiTablet className="mr-2 text-accent-600" />
              <span className="text-sm font-medium">Tablet</span>
            </div>
            <span className="text-sm font-medium">{data.tablet}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-accent-600 h-2 rounded-full" style={{ width: `${data.tablet}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopCities = ({ data }) => {
  return (
    <div className="dashboard-card">
      <h3 className="text-base font-medium mb-4">Top Cities</h3>
      {data.map((city, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex justify-between mb-1">
            <div className="flex items-center">
              <FiMapPin className="mr-2 text-primary-600" />
              <span className="text-sm font-medium">{city.city}</span>
            </div>
            <span className="text-sm font-medium">{city.visits.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${(city.visits / data[0].visits) * 100}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TopProperties = ({ data }) => {
  return (
    <div className="dashboard-card">
      <h3 className="text-base font-medium mb-4">Top Properties</h3>
      {data.map((property, index) => (
        <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold mr-3">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium">{property.title}</p>
              <p className="text-xs text-gray-500">{property.views.toLocaleString()} views</p>
            </div>
          </div>
          <div>
            <FiHome className="h-5 w-5 text-primary-600" />
          </div>
        </div>
      ))}
    </div>
  );
};

const VisitorsStats = ({ data }) => {
  const chartData = data.dailyVisits.map((value, index) => ({
    name: data.weeklyLabels[index],
    visits: value
  }));

  return (
    <div className="dashboard-card">
      <h3 className="text-base font-medium mb-4">Weekly Visitors</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="visits" stroke="#0284c7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AnalyticsCharts = ({ analyticsData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <VisitorsStats data={analyticsData} />
      <TopCities data={analyticsData.topCities} />
      <DeviceStats data={analyticsData.deviceStats} />
      <div className="lg:col-span-3">
        <TopProperties data={analyticsData.topProperties} />
      </div>
    </div>
  );
};

export default AnalyticsCharts;