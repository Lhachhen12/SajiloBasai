import { useState } from 'react';
import { FiMail, FiPhone, FiMessageSquare, FiTrash2 } from 'react-icons/fi';

const Contact = () => {
  const [contacts] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      message: 'Interested in listing my property',
      date: '2024-02-20',
      status: 'New'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      message: 'Need help finding an apartment',
      date: '2024-02-19',
      status: 'Replied'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-500">Manage and respond to contact form submissions</p>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{contacts.length}</div>
          <div className="text-sm text-gray-500">Total Messages</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {contacts.filter(c => c.status === 'New').length}
          </div>
          <div className="text-sm text-gray-500">New Messages</div>
        </div>
        <div className="bg-white rounded-lg shadow-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {contacts.filter(c => c.status === 'Replied').length}
          </div>
          <div className="text-sm text-gray-500">Replied</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-select"
          >
            <option value="all">All Messages</option>
            <option value="new">New</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="text-sm text-gray-500">{contact.date}</div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiMail className="mr-2" />
                    {contact.email}
                    <span className="mx-2">|</span>
                    <FiPhone className="mr-2" />
                    {contact.phone}
                  </div>
                  <div className="flex items-start">
                    <FiMessageSquare className="mr-2 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">{contact.message}</p>
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete message"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  contact.status === 'New'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;