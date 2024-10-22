import { useState } from 'react';

const FilterModal = ({ onClose, onApply }) => {
  const [priceRange, setPriceRange] = useState([0, 9500]); // Adjusted price range
  const [guests, setGuests] = useState('Any');
  const [features, setFeatures] = useState({
    beach_view: false,
    helicopter_pad: false,
    garden_view: false,
    pool: false,
    balcony: false,
    city_view: false,
    overwater_bungalow: false,
  });
  const [services, setServices] = useState({
    private_chef: false,
    spa: false,
    ski_rentals: false,
    laundry: false,
  });

  const handleApply = () => {
    onApply({ priceRange, guests, features, services });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search location"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button className="absolute right-3 top-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12m-6 0a6 6 0 1112 0 6 6 0 01-12 0zm12 0l4 4" />
            </svg>
          </button>
        </div>

        {/* Price Range Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Price Range (€)</label>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm">€{priceRange[0]}</span>
            <input
              type="range"
              min="0"
              max="9500"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="w-1/3 mx-2"
            />
            <input
              type="range"
              min="0"
              max="9500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-1/3 mx-2"
            />
            <span className="text-sm">€{priceRange[1]}</span>
          </div>
        </div>

        {/* Number of Guests Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Any', 1, 2, 4, 6, 8, 10, '12+'].map((option) => (
              <button
                key={option}
                onClick={() => setGuests(option)}
                className={`px-4 py-2 rounded-full border ${
                  guests === option ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Property Features Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Property Features</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.keys(features).map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  checked={features[feature]}
                  onChange={() => setFeatures({ ...features, [feature]: !features[feature] })}
                  className="mr-2 rounded"
                />
                <span className="text-sm capitalize">
                  {feature.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Services Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Services</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {Object.keys(services).map((service) => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={services[service]}
                  onChange={() => setServices({ ...services, [service]: !services[service] })}
                  className="mr-2 rounded"
                />
                <span className="text-sm capitalize">
                  {service.replace(/_/g, ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="w-full mr-2 bg-gray-300 text-gray-700 py-2 rounded-lg">
            Cancel
          </button>
          <button onClick={handleApply} className="w-full ml-2 bg-teal-600 text-white py-2 rounded-lg">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
