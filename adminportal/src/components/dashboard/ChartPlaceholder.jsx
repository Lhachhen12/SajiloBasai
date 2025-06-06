import { FiBarChart, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const iconComponents = {
  bar: FiBarChart,
  pie: FiPieChart,
  line: FiTrendingUp
};

const ChartPlaceholder = ({ title, type = 'bar', height = 'h-64' }) => {
  const IconComponent = iconComponents[type] || iconComponents.bar;
  
  return (
    <div className={`bg-white rounded-lg shadow-card p-4 ${height}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      </div>
      <div className="flex items-center justify-center h-4/5 border border-dashed border-gray-200 rounded-lg bg-gray-50">
        <div className="text-center">
          <IconComponent className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Chart visualization will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default ChartPlaceholder;