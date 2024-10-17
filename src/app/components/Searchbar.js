// SearchBar.js
import { useState } from 'react';
import { SearchIcon, FilterIcon } from '@heroicons/react/outline'; 

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch(searchTerm); // Ensure onSearch is a function before calling it
    } else {
      console.error("onSearch prop is not a function", onSearch);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center bg-white shadow-md rounded-full p-2 w-full">
      <SearchIcon className="h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Where to?"
        className="ml-2 flex-grow outline-none text-sm text-gray-600"
      />
      <button type="submit" className="ml-2 p-2 bg-gray-200 rounded-full">
        <FilterIcon className="h-5 w-5 text-gray-400" />
      </button>
    </form>
  );
};

export default SearchBar;
