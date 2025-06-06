import { FiUsers, FiHome, FiMessageSquare, FiUserCheck, FiActivity } from 'react-icons/fi';

const iconMap = {
  users: <FiUsers className="h-8 w-8 text-primary-600" />,
  listings: <FiHome className="h-8 w-8 text-secondary-600" />,
  inquiries: <FiMessageSquare className="h-8 w-8 text-accent-600" />,
  sellers: <FiUserCheck className="h-8 w-8 text-success" />,
  visits: <FiActivity className="h-8 w-8 text-warning" />
};

const StatsCard = ({ title, value, type, percentage, isIncrease = true }) => {
  return (
    <div className="dashboard-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {percentage && (
              <span className={`ml-2 text-xs font-medium ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                {isIncrease ? '+' : '-'}{percentage}%
              </span>
            )}
          </div>
        </div>
        <div>
          {iconMap[type]}
        </div>
      </div>
      <div className="mt-4">
        <div className="overflow-hidden h-1 mb-1 text-xs flex rounded bg-gray-200">
          <div 
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              isIncrease ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage || 70}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">vs. last month</p>
      </div>
    </div>
  );
};

export default StatsCard;