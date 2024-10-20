// FilterModal.js
import { useState } from 'react';

const FilterModal = ({ onClose, onApply }) => {
  const [priceRange, setPriceRange] = useState([0, 2000]); // Adjusted price range
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        {/* Price Range Filter */}
        <div className="mb-4">
          <label>Price Range (€)</label>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              min="0"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="border rounded p-2 w-1/2"
            />
            <input
              type="number"
              min="0"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="border rounded p-2 w-1/2"
            />
          </div>
        </div>

        {/* Number of Guests Filter */}
        <div className="mb-4">
          <label>Number of Guests</label>
          <div className="flex gap-2">
            {['Any', 1, 2, 4, 6, 8, 10, '12+'].map((option) => (
              <button
                key={option}
                onClick={() => setGuests(option)}
                className={`p-2 rounded ${guests === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Property Features Filter */}
        <div className="mb-4">
          <label>Property Features</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(features).map((feature) => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  checked={features[feature]}
                  onChange={() => setFeatures({ ...features, [feature]: !features[feature] })}
                  className="mr-2"
                />
                {feature.split(/(?=[A-Z])/).join(' ')}
              </label>
            ))}
          </div>
        </div>

        {/* Services Filter */}
        <div className="mb-4">
          <label>Services</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(services).map((service) => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={services[service]}
                  onChange={() => setServices({ ...services, [service]: !services[service] })}
                  className="mr-2"
                />
                {service.split(/(?=[A-Z])/).join(' ')}
              </label>
            ))}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
          <button onClick={handleApply} className="bg-blue-500 text-white p-2 rounded">Apply Filters</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
