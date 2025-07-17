// components/superSearch/SuperSearchBar.js
import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { performSuperSearch } from '../../api/recommendationApi';

const SuperSearchBar = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
  if (!searchQuery.trim()) {
    onSearchResults(null, ''); // Pass empty query when clearing
    return;
  }

  setIsSearching(true);
  try {
    const results = await performSuperSearch(searchQuery);
    onSearchResults(results, searchQuery); // Pass both results and query
  } catch (error) {
    console.error('Search failed:', error);
    onSearchResults([], searchQuery); // Show empty state but keep query
  } finally {
    setIsSearching(false);
  }
};
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchResults(null); // Reset to show all properties
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search room (eg. rooms under 15k)"
            className="flex-grow px-6 py-4 focus:outline-none text-gray-800 placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className={`bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-4 flex items-center justify-center transition-all ${isSearching ? 'opacity-75' : 'hover:from-blue-600 hover:to-teal-600'} ${!searchQuery.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSearching ? 'Searching...' : (
              <>
                <FaSearch className="mr-2" />
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperSearchBar;