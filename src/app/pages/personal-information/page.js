'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        
        const userId = currentUser.uid;
        try {
          const userDocRef = doc(db, 'users', userId); 
          const userDoc = await getDoc(userDocRef); 
          if (userDoc.exists()) {
            setEmail(userDoc.data().email); 
          }
        } catch (error) {
          console.error('Error fetching user data:', error); 
        }
      } else {
        
        
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center px-6 pt-10">
  <button
  className="absolute top-15 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
  onClick={() => router.back()}
  >
  <ArrowLeftIcon className="w-5 h-5" /> 
  </button>
      <h1 className="text-2xl font-semibold mb-6">Profile</h1>

      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 font-bold">
          {email ? email.charAt(0).toUpperCase() : 'A'} 
        </div>
      </div>

      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
  <div className="mb-4">
    <label className="block text-gray-600 text-sm mb-2">Name</label>
    <input
      type="text"
      value={email ? email.substring(0, 7) : ''} 
      readOnly
      className="w-full p-3 border rounded bg-gray-50 text-gray-500"
    />
  </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input
            type="text"
            value={email || ''} 
            readOnly
            className="w-full p-3 border rounded bg-gray-50 text-gray-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <input
            type="password"
            value="********" 
            readOnly
            className="w-full p-3 border rounded bg-gray-50 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
}
