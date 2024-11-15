'use client'

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Navbar from './components/Navbar';
import NavbarDesktop from './components/NavbarDesktop';
import Link from 'next/link';
import SearchBar from './components/Searchbar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useMediaQuery } from 'react-responsive';
import Footer from './components/Footer';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserFavorites(user.uid);
      } else {
        setUser(null);
        setFavoriteIds([]);
      }
    });

    return () => unsubscribe();
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
        setFilteredProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const fetchUserFavorites = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      setFavoriteIds(userDoc.data().favorites || []);
    } else {
      console.error("User document does not exist");
    }
  };

  const handleFavorite = async (propertyId) => {
    if (!user) {
      alert("You must be logged in to favorite properties.");
      return;
    }

    const userRef = doc(db, 'users', user.uid);

    try {
      if (favoriteIds.includes(propertyId)) {
        await updateDoc(userRef, {
          favorites: arrayRemove(propertyId),
        });
        setFavoriteIds((prev) => prev.filter(id => id !== propertyId));
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(propertyId),
        });
        setFavoriteIds((prev) => [...prev, propertyId]);
      }
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    }
  };

  const handleSearch = (searchTerm) => {
    setLoading(true);
    if (searchTerm) {
      const filtered = properties.filter(property => {
        const cityMatch = property.location.city.toLowerCase().includes(searchTerm.toLowerCase());
        const countryMatch = property.location.country.toLowerCase().includes(searchTerm.toLowerCase());
        return cityMatch || countryMatch;
      });
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(properties);
    }
    setLoading(false);
  };

  const handleApplyFilters = (filters) => {
    const { priceRange, guests, features, services } = filters;

    const filtered = properties.filter((property) => {
      const withinPriceRange = property.price >= priceRange[0] && property.price <= priceRange[1];
      const matchesGuests = guests === 'Any' || property.guests >= guests;

      const matchesFeatures = Object.keys(features).every(feature => {
        return !features[feature] || property.property_features[feature];
      });

      const matchesServices = Object.keys(services).every(service => {
        return !services[service] || property.services[service];
      });

      return withinPriceRange && matchesGuests && matchesFeatures && matchesServices;
    });

    setFilteredProperties(filtered);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {isDesktop ? <NavbarDesktop /> : <SearchBar onSearch={handleSearch} onApplyFilters={handleApplyFilters} />}

      <main className="flex-grow container mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div key={property.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer">
                <Link href={`/pages/${property.id}`}>
                  <div className="relative">
                    <img
                      src={property.imageUrl || '/placeholder.jpg'}
                      alt={property.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>

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
                  <span className={`text-2xl ${favoriteIds.includes(property.id) ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                </button>
              </div>
            ))
          ) : (
            <p>No properties found for the selected criteria.</p>
          )}
        </div>
      </main>

      {!isDesktop && <Navbar />}

      {isDesktop && <Footer className="mt-auto" />}
    </div>
  );
}
