// NavbarDesktop.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon } from '@heroicons/react/solid';
import { auth, db } from '../../../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const NavbarDesktop = () => {
  const [user, setUser] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user); // Update state when user logs in or out

      if (user) {
        // Fetch user favorites from Firestore
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserFavorites(userData.favorites || []); // Set favorites if they exist
        } else {
          console.log('No such document!');
        }
      } else {
        setUserFavorites([]); // Reset favorites if no user is logged in
      }
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, []);

  return (
    <nav className="flex items-center justify-between bg-gray-50 p-4 shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
        <img src="/pictures/logga.png" alt="LuxeStay Logo" className="h-11" />
        
      </div>

      {/* Links and Profile Icon */}
      <div className="flex items-center space-x-6">
        {/* Favorites Link */}
        <button
          onClick={() => router.push('/pages/favorites')}
          className={`text-gray-600 hover:text-gray-800 ${userFavorites.length === 0 && 'opacity-50'}`} // Check length safely
        >
          Favorites {userFavorites.length ? `(${userFavorites.length})` : ''}
        </button>
        
        {/* Trips Link */}
        <button
          onClick={() => router.push('/pages/Trips')}
          className="text-gray-600 hover:text-gray-800"
        >
          Trips
        </button>

        {/* Profile Button */}
        <button
          className="p-2 bg-gray-200 rounded-full"
          onClick={() => {
            router.push(user ? '/pages/profile' : '/pages/login');
          }}
        >
          <UserIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </nav>
  );
};

export default NavbarDesktop;
