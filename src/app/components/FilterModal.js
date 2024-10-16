'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react'; // For modal dialog

export default function FilterModal({ isOpen, onClose, applyFilters }) {
  const [priceRange, setPriceRange] = useState([3500, 9500]);
  const [guests, setGuests] = useState('Any');
  const [features, setFeatures] = useState({
    oceanView: false,
    privatePool: false,
    helipad: false,
    rooftopTerrace: false,
  });
  const [services, setServices] = useState({
    privateChef: false,
    chauffeur: false,
    yachtRentals: false,
    spa: false,
  });

  const handleApplyFilters = () => {
    applyFilters({ priceRange, guests, features, services });
    onClose(); // Close modal after applying filters
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <span className="inline-block h-screen align-middle">&#8203;</span>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">Filter</Dialog.Title>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block font-medium text-gray-700">Price Range</label>
            <input type="range" min={3500} max={9500} value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>€3,500</span>
              <span>€9,500</span>
            </div>
          </div>

          {/* Number of Guests */}
          <div className="mt-4">
            <label className="block font-medium text-gray-700">Number of Guests</label>
            <div className="flex gap-2">
              {['Any', 1, 2, 4, 8].map((guest) => (
                <button key={guest} className={`py-2 px-4 rounded ${guests === guest ? 'bg-gray-800 text-white' : 'bg-gray-200'}`} onClick={() => setGuests(guest)}>
                  {guest}
                </button>
              ))}
            </div>
          </div>

          {/* Property Features */}
          <div className="mt-4">
            <label className="block font-medium text-gray-700">Property Features</label>
            <div className="space-y-2">
              {Object.keys(features).map((feature) => (
                <label key={feature} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={features[feature]}
                    onChange={() => setFeatures({ ...features, [feature]: !features[feature] })}
                    className="form-checkbox"
                  />
                  <span className="text-gray-600">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="mt-4">
            <label className="block font-medium text-gray-700">Services</label>
            <div className="space-y-2">
              {Object.keys(services).map((service) => (
                <label key={service} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={services[service]}
                    onChange={() => setServices({ ...services, [service]: !services[service] })}
                    className="form-checkbox"
                  />
                  <span className="text-gray-600">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cancel and Apply Buttons */}
          <div className="mt-6 flex justify-between">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="px-4 py-2 bg-black text-white rounded" onClick={handleApplyFilters}>
              Search
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
