'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Assuming firebaseConfig is set up
import Navbar from './components/Navbar'; // Importing the Navbar
import Link from 'next/link'; // Import Link for navigation

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> {/* Adjust grid columns based on screen size */}
          {properties.map((property) => (
            <Link href={`/pages/${property.id}`} key={property.id}> {/* Navigate to property details */}
              <div className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={property.imageUrl || '/placeholder.jpg'}
                    alt={property.name}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Property Info Section */}
                <div className="p-4 flex justify-between items-start"> {/* Flex layout for text and rating */}
                  <div>
                    <h3 className="text-xl font-semibold">{property.name}</h3>
                    <p className="text-gray-600">{property.location.city}, {property.location.country}</p>
                    <p className="text-gray-900 font-bold">{property.price}€ / night</p>
                  </div>
                  {/* Rating Display */}
                  <p className="text-red-500 font-bold ml-4">★ {property.host.rating}</p> {/* Rating to the right */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navbar Component */}
      <Navbar /> {/* Navbar imported and rendered here */}
    </div>
  );
}
