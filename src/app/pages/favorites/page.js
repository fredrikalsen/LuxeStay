'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../../../firebaseConfig'; // Adjust path as necessary
import { db } from '../../../../firebaseConfig'; // Adjust path as necessary
import { collection, doc, getDoc } from 'firebase/firestore';
import Navbar from '../../components/Navbar';

export default function Favorites() {
  const [userFavorites, setUserFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser; // Get the current user

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log('User data:', userData); // Debugging line
          setUserFavorites(userData.favorites || []); // Get the favorites array
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No user is signed in');
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      const propertiesList = [];

      // Fetch property details for each favorite
      for (const favoriteId of userFavorites) {
        const propertyRef = doc(db, 'properties', favoriteId);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          propertiesList.push({ id: favoriteId, ...propertySnap.data() });
        } else {
          console.log(`Property with ID ${favoriteId} does not exist`); // Debugging line
        }
      }

      console.log('Fetched properties:', propertiesList); // Debugging line
      setProperties(propertiesList);
    };

    if (userFavorites.length > 0) {
      fetchProperties();
    }
  }, [userFavorites]);

  if (loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {properties.length === 0 ? (
        <p>No favorites found.</p>
      ) : (
        <ul className="w-full max-w-lg">
          {properties.map((property) => (
            <li key={property.id} className="border-b py-4">
              <h2 className="text-xl">{property.title}</h2>
              <p>{property.description}</p>
              <p className="text-gray-600">Price: ${property.price}</p>
              {/* Add other property details as necessary */}
            </li>
          ))}
        </ul>
      )}
      <Navbar />
    </div>
    
  );
}
