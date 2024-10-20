// SearchBar.js
import { useState } from 'react';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline';
import FilterModal from './FilterModal';

const SearchBar = ({ onSearch, onApplyFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch(searchTerm);
    }
  };

  const handleFilterApply = (filters) => {
    if (typeof onApplyFilters === 'function') {
      onApplyFilters(filters);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center bg-white shadow-md rounded-full p-2 w-full">
        <SearchIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Where to?"
          className="ml-2 flex-grow outline-none text-sm text-gray-600"
        />
        <button
          type="button"
          className="ml-2 p-2 bg-gray-200 rounded-full"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <FilterIcon className="h-5 w-5 text-gray-400" />
        </button>
      </form>

      {isFilterModalOpen && (
        <FilterModal
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleFilterApply}
        />
      )}
    </>
  );
};

export default SearchBar;
