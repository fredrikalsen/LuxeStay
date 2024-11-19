'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../firebaseConfig'; // Adjust path to your Firebase configuration
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../../../firebaseConfig'; // Ensure you import your Firestore configuration
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the userId

      console.log('User registered successfully:', userId);

      // Create a user document in Firestore with bookings array
      await setDoc(doc(db, 'users', userId), {
        email: email,
        favorites: [], 
        bookings: [], 
      });

      // Redirect to a welcome page or home page after successful registration
      router.push('/'); 
    } catch (err) {
      console.error('Error registering:', err);
      setError(err.message); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg"
          >
            Continue
          </button>
        </form>
        <button
          className="absolute top-12 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5" /> {/* Heroicons arrow */}
        </button>
      </div>
    </div>
  );
}
