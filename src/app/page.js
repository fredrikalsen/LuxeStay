'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore'; // Import arrayRemove for removing favorites
import { db } from '../../firebaseConfig'; // Adjust the path as needed
import Navbar from './components/Navbar'; // Importing the Navbar
import Link from 'next/link'; // Import Link for navigation
import SearchBar from './components/Searchbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; // Adjust path as needed

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]); // State to track favorite property IDs

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is logged in
        fetchUserFavorites(user.uid); // Fetch favorites when user is logged in
      } else {
        setUser(null); // User is logged out
        setFavoriteIds([]); // Clear favorites if no user
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        const propertiesData = [];
        querySnapshot.forEach((doc) => {
          propertiesData.push({ ...doc.data(), id: doc.id });
        });
        setProperties(propertiesData);
        setFilteredProperties(propertiesData); // Initially, set filtered properties to all properties
      } catch (error) {
        console.error("Error fetching properties: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fetch user favorites when user logs in
  const fetchUserFavorites = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef); // Get the user's document

    if (userDoc.exists()) {
      setFavoriteIds(userDoc.data().favorites || []); // Set favorite IDs from user's document
    } else {
      console.error("User document does not exist");
    }
  };

  // Toggle favorite functionality
  const handleFavorite = async (propertyId) => {
    if (!user) {
      alert("You must be logged in to favorite properties.");
      return;
    }

    const userRef = doc(db, 'users', user.uid);

    try {
      // Check if property is already a favorite
      if (favoriteIds.includes(propertyId)) {
        // Remove propertyId from favorites
        await updateDoc(userRef, {
          favorites: arrayRemove(propertyId), // Remove propertyId from the favorites array
        });
        setFavoriteIds((prevFavorites) => prevFavorites.filter(id => id !== propertyId)); // Update local favorites state
      } else {
        // Add propertyId to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(propertyId), // Add propertyId to the favorites array
        });
        setFavoriteIds((prevFavorites) => [...prevFavorites, propertyId]); // Update local favorites state
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    }
  };

  // Search function that filters properties based on the city or country
  const handleSearch = async (searchTerm) => {
    setLoading(true);
    if (searchTerm) {
      const filtered = properties.filter(property => {
        const cityMatch = property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
        const countryMatch = property.location.country.toLowerCase().includes(searchTerm.toLowerCase());
        return cityMatch || countryMatch; // Filter if either city or country matches
      });
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties); // Reset to all properties if search is empty
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching data
  }

  return (
    <div className="relative min-h-screen pb-16"> {/* Ensures space for navbar */}
      <SearchBar onSearch={handleSearch} /> {/* Pass handleSearch to SearchBar */}
      
      {/* Property List */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"> {/* Adjust grid columns based on screen size */}
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
                <Link href={`/pages/${property.id}`}>
                  {/* Image Section */}
                  <div className="relative">
                    <img
                      src={property.imageUrl || '/placeholder.jpg'}
                      alt={property.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  {/* Property Info Section */}
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{property.name}</h3>
                      <p className="text-gray-600">{property.location.city}, {property.location.country}</p>
                      <p className="text-gray-900 font-bold">{property.price}€ / night</p>
                    </div>
                    <p className="text-red-500 font-bold ml-4">★ {property.host.rating}</p>
                  </div>
                </Link>
                <button onClick={() => handleFavorite(property.id)} className="absolute top-4 right-4">
                  {/* Conditional rendering of the heart icon */}
                  <span className={`text-2xl ${favoriteIds.includes(property.id) ? 'text-red-500' : 'text-white'}`}>
                    ♥
                  </span>
                </button>
              </div>
            ))
          ) : (
            <p>No properties found for the selected criteria.</p>
          )}
        </div>
      </div>

      {/* Navbar Component */}
      <Navbar /> {/* Navbar imported and rendered here */}
    </div>
  );
}
