import { useState, useEffect } from 'react';
import {
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../utils/adminApi';
import { FiMail, FiPhone, FiMessageSquare, FiTrash2, FiFilter, FiAlertCircle, FiStar } from 'react-icons/fi';

const Contact = ({ isDark }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const contactsData = await getContacts();
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contacts data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleStatusUpdate = async (contactId, status) => {
    setUpdating(contactId);
    try {
      const result = await updateContactStatus(contactId, status);
      
      if (result.success) {
        setContacts(
          contacts.map((contact) =>
            contact.id === contactId || contact._id === contactId 
              ? { ...contact, status } 
              : contact
          )
        );
      } else {
        console.error('Failed to update contact status:', result.message);
        alert('Failed to update contact status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('An error occurred while updating the contact status.');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setDeleting(contactId);
      try {
        const result = await deleteContact(contactId);
        
        if (result.success) {
          setContacts(contacts.filter((contact) => 
            contact.id !== contactId && contact._id !== contactId
          ));
        } else {
          console.error('Failed to delete contact:', result.message);
          alert('Failed to delete contact. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('An error occurred while deleting the contact.');
      } finally {
        setDeleting(null);
      }
    }
  };

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    const priorityStyles = {
      High: isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800',
      Medium: isDark ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
      Low: isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800',
    };
    
    return priorityStyles[priority] || (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  // Category badge styling
  const getCategoryBadge = (category) => {
    const categoryStyles = {
      'Property Listing': isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800',
      'General Inquiry': isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800',
    };
    
    return categoryStyles[category] || (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-full border-4 ${
              isDark ? 'border-blue-900' : 'border-blue-200'
            }`}></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading contacts...
          </p>
        </div>
      </div>
    );
  }

  const filteredContacts = contacts.filter((contact) => {
    if (filter === 'all') return true;
    return contact.status.toLowerCase() === filter.toLowerCase();
  });

  const statusCounts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === 'New').length,
    replied: contacts.filter((c) => c.status === 'Replied').length,
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Contact Messages
        </h1>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage and respond to contact form submissions
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-lg shadow-card p-4 text-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {statusCounts.all}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Total Messages
          </div>
        </div>
        <div className={`rounded-lg shadow-card p-4 text-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-2xl font-bold text-green-600">
            {statusCounts.new}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            New Messages
          </div>
        </div>
        <div className={`rounded-lg shadow-card p-4 text-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-2xl font-bold text-blue-600">
            {statusCounts.replied}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Replied
          </div>
        </div>
        <div className={`rounded-lg shadow-card p-4 text-center ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-2xl font-bold text-purple-600">
            {contacts.filter(c => c.priority === 'High').length}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            High Priority
          </div>
        </div>
      </div>

      <div className={`rounded-lg shadow-card overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiFilter className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={`px-3 py-2 rounded-md ${
                  isDark 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-gray-100 text-gray-900 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Messages</option>
                <option value="new">New</option>
                <option value="replied">Replied</option>
              </select>
            </div>
            
            {/* Priority filter (optional) */}
            <select
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setFilter('all');
                } else {
                  // Filter by priority - you might need to adjust this based on your needs
                  const priorityContacts = contacts.filter(c => c.priority === e.target.value);
                  // This is a simple implementation - you might want a more robust filtering system
                  setContacts(priorityContacts);
                }
              }}
              className={`px-3 py-2 rounded-md ${
                isDark 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-gray-100 text-gray-900 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {filteredContacts.length} of {contacts.length} messages
          </div>
        </div>

        <div className={`divide-y ${
          isDark ? 'divide-gray-700' : 'divide-gray-200'
        }`}>
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center">
              <FiMessageSquare className={`mx-auto h-12 w-12 ${
                isDark ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <h3 className={`mt-4 text-lg font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-900'
              }`}>
                No contacts found
              </h3>
              <p className={`mt-2 text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {filter === 'all' 
                  ? 'No contact messages have been received yet.' 
                  : `No ${filter} contact messages found.`
                }
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id || contact._id}
                className={`p-6 ${isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} transition-colors duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className={`font-medium ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {contact.name}
                      </div>
                      <span className={`mx-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
                      <div className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {contact.date || new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(contact.priority)}`}>
                        {contact.priority === 'High' && <FiStar className="mr-1 w-3 h-3" />}
                        {contact.priority || 'No Priority'}
                      </span>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadge(contact.category)}`}>
                        {contact.category || 'No Category'}
                      </span>
                    </div>
                    
                    <div className={`flex items-center text-sm mb-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <FiMail className="mr-2" />
                      {contact.email}
                      <span className="mx-2">|</span>
                      <FiPhone className="mr-2" />
                      {contact.phone || 'No phone provided'}
                    </div>
                    
                    <div className="mb-2">
                      <div className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {contact.subject || 'No subject'}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiMessageSquare className={`mr-2 mt-1 flex-shrink-0 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {contact.message}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex space-x-2">
                    {contact.status === 'New' && (
                      <button
                        onClick={() => handleStatusUpdate(contact.id || contact._id, 'Replied')}
                        disabled={updating === (contact.id || contact._id)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Mark as replied"
                      >
                        {updating === (contact.id || contact._id) ? 'Updating...' : 'Mark Replied'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(contact.id || contact._id)}
                      disabled={deleting === (contact.id || contact._id)}
                      className={`p-2 rounded-full ${
                        isDark 
                          ? 'text-red-500 hover:bg-red-900/30' 
                          : 'text-red-600 hover:bg-red-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Delete message"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contact.status === 'New'
                        ? isDark
                          ? 'bg-green-900/30 text-green-300'
                          : 'bg-green-100 text-green-800'
                        : isDark
                        ? 'bg-blue-900/30 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;