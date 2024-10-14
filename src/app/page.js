'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Assuming firebaseConfig is set up
import Navbar from './components/Navbar'; // Importing the Navbar

export default function Home() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const querySnapshot = await getDocs(collection(db, 'properties'));
      const propertiesData = [];
      querySnapshot.forEach((doc) => {
        propertiesData.push({ ...doc.data(), id: doc.id });
      });
      setProperties(propertiesData);
    };

    fetchProperties();
  }, []);

  return (
    <div className="relative min-h-screen pb-16"> {/* Ensures space for navbar */}
      {/* Property List */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {properties.map((property) => (
            <div
              key={property.id}
              className="relative bg-white shadow-lg rounded-lg overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={property.imageUrl || '/placeholder.jpg'}
                  alt={property.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                  <span className="text-red-500 text-xl">★</span>
                </div>
              </div>

              {/* Property Info Section */}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{property.name}</h3>
                <p className="text-gray-600">{property.location.city}, {property.location.country}</p>
                <p className="text-gray-900 font-bold">{property.price}€ / night</p>
                <p className="text-red-500">★ {property.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navbar Component */}
      <Navbar /> {/* Navbar imported and rendered here */}
    </div>
  );
}
