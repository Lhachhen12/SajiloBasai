import PropTypes from 'prop-types';

const EditBookingForm = ({ formData, isDark, handleInputChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buyer Name */}
        <div>
          <label 
            htmlFor="buyerName" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Buyer Name
          </label>
          <input
            type="text"
            id="buyerName"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label 
            htmlFor="email" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>

        {/* Property ID */}
        <div>
          <label 
            htmlFor="propertyId" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Property ID
          </label>
          <input
            type="text"
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>

        {/* Check-in Date */}
        <div>
          <label 
            htmlFor="checkInDate" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Check-in Date
          </label>
          <input
            type="date"
            id="checkInDate"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label 
            htmlFor="duration" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Duration (months)
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            min="1"
            value={formData.duration}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>

        {/* Total Amount */}
        <div>
          <label 
            htmlFor="totalAmount" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Total Amount ($)
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            min="0"
            step="0.01"
            value={formData.totalAmount}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          />
        </div>

        {/* Payment Status */}
        <div>
          <label 
            htmlFor="paymentStatus" 
            className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Payment Status
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border transition-colors ${
              isDark 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500/20`}
            required
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancel}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isDark 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-6 py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors`}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

EditBookingForm.propTypes = {
  formData: PropTypes.object.isRequired,
  isDark: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default EditBookingForm;