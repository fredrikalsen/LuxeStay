'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../firebaseConfig'; // Adjust path to your Firebase configuration
import { signOut } from 'firebase/auth';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await signOut(auth);
        console.log('User signed out successfully');
        // Redirect to home page or login page after logout
        router.push('/'); // Adjust the route as needed
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    logoutUser();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold">Logging out...</h1>
    </div>
  );
}
