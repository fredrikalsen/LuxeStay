'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { auth } from '../../../../firebaseConfig';
import { db } from '../../../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore'; 
import Navbar from '../../components/Navbar';
import NavbarDesktop from '../../components/NavbarDesktop'; 
import Footer from '../../components/Footer'; 
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function Favorites() {
  const [userFavorites, setUserFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 
  const [isDesktop, setIsDesktop] = useState(false); 

  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserFavorites(userData.favorites || []);
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

      for (const favoriteId of userFavorites) {
        const propertyRef = doc(db, 'properties', favoriteId);
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          propertiesList.push({ id: favoriteId, ...propertySnap.data() });
        } else {
          console.log(`Property with ID ${favoriteId} does not exist`);
        }
      }

      setProperties(propertiesList);
    };

    if (userFavorites.length > 0) {
      fetchProperties();
    }
  }, [userFavorites]);

 
  const handlePropertyClick = (id) => {
    router.push(`/pages/${id}`);
  };

  
  const handleRemoveFavorite = async (propertyId) => {
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);

      try {
       
        await updateDoc(userRef, {
          favorites: arrayRemove(propertyId),
        });

        
        setUserFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite !== propertyId)
        );
        setProperties((prevProperties) =>
          prevProperties.filter((property) => property.id !== propertyId)
        );
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {isDesktop ? (
        <NavbarDesktop user={auth.currentUser} favoriteIds={userFavorites} /> 
      ) : (
        <Navbar /> 
      )}
      <div className="flex flex-col items-center p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-8">Favorites</h1>
        {properties.length === 0 ? (
          <p>No favorites found.</p>
        ) : (
          <ul className="w-full max-w-3xl">
            {properties.map((property) => (
              <li 
                key={property.id} 
                className="mb-6 p-4 bg-white rounded-lg shadow-lg flex items-center cursor-pointer hover:bg-gray-100 transition duration-200"
                onClick={() => handlePropertyClick(property.id)}
              >
                <img 
                  src={property.imageUrl || '/placeholder.png'} 
                  alt={property.title} 
                  className="w-24 h-24 rounded-md object-cover mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{property.name}</h2>
                  </div>
                  <p className="text-gray-600">{property.location?.city}, {property.location?.country}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 text-lg mr-1">★</span>
                    <span>{property.host.rating || 0}</span>
                    <span className="text-gray-500 ml-1">
                      ({property.reviews ? property.reviews.length : 0})
                    </span>
                  </div>
                  <p className="text-gray-800 font-bold mt-1">€ {property.price} / night</p>
                </div>
                <div className="ml-4" onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(property.id);
                }}>
                  <button className="text-yellow-500 text-2xl">★</button>
                </div>
                <button
          className="absolute top-16 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5" /> 
        </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isDesktop && <Footer />} 
    </div>
  );
}
