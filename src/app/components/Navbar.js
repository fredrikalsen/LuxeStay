import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebaseConfig'; 
import { HomeIcon, HeartIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/solid';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // No user is signed in
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md">
      <div className="flex justify-around py-2">
        
        {/* Explore */}
        <div 
          className="flex flex-col items-center cursor-pointer hover:text-gray-900 transition-colors duration-200"
          onClick={() => router.push('/')}
        >
          <GlobeAltIcon className="h-6 w-6 text-gray-500 hover:text-gray-900" />
          <span className="text-xs text-gray-600 hover:text-gray-900">Explore</span>
        </div>

        {/* Favorites */}
        <div 
          className="flex flex-col items-center cursor-pointer hover:text-gray-900 transition-colors duration-200"
          onClick={() => router.push('/pages/favorites')}
        >
          <HeartIcon className="h-6 w-6 text-gray-500 hover:text-gray-900" />
          <span className="text-xs text-gray-600 hover:text-gray-900">Favorites</span>
        </div>

        {/* Trips */}
        <div 
          className="flex flex-col items-center cursor-pointer hover:text-gray-900 transition-colors duration-200"
          onClick={() => router.push('/pages/Trips')}
        >
          <HomeIcon className="h-6 w-6 text-gray-500 hover:text-gray-900" />
          <span className="text-xs text-gray-600 hover:text-gray-900">Trips</span>
        </div>

        {/* Profile */}
        <div 
          className="flex flex-col items-center cursor-pointer hover:text-gray-900 transition-colors duration-200"
          onClick={() => router.push(isLoggedIn ? '/pages/profile' : '/pages/login')}
        >
          <UserIcon className="h-6 w-6 text-gray-500 hover:text-gray-900" />
          <span className="text-xs text-gray-600 hover:text-gray-900">Profile</span>
        </div>
      </div>
    </nav>
  );
}
