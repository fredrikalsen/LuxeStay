'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../../../firebaseConfig'; 
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; 
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); 
  
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the userId
  
      console.log('User logged in successfully:', userId);
  
      // Reference to the users Firestore document
      const userDocRef = doc(db, 'users', userId);
      
      // Check if user document exists in Firestore
      const userDoc = await getDoc(userDocRef);
  
      // If user document doesnt exist, create it
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: email,
          favorites: [], 
          bookings: [] 
        });
        console.log('User document created in Firestore');
      } else {
        
        const data = userDoc.data();
        if (!data.bookings) {
          await updateDoc(userDocRef, {
            bookings: [] 
          });
          console.log('Bookings field added to user document');
        } else {
          console.log('User document already contains bookings field');
        }
      }
  
      
      router.push('/'); 
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.message); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
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
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/pages/register" className="text-black font-semibold">Register here</a>
          </p>
        </div>
        <button
          className="absolute top-12 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5" /> 
        </button>
      </div>
    </div>
  );
}
