'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../firebaseConfig'; // Adjust path to your Firebase configuration
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../../../firebaseConfig'; // Ensure you import your Firestore configuration
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
  
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the userId
  
      console.log('User logged in successfully:', userId);
  
      // Reference to the user's Firestore document
      const userDocRef = doc(db, 'users', userId);
      
      // Check if user document exists in Firestore
      const userDoc = await getDoc(userDocRef);
  
      // If user document doesn't exist, create it
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: email,
          favorites: [], // Initialize an empty favorites array
          bookings: [] // Initialize an empty bookings array
        });
        console.log('User document created in Firestore');
      } else {
        // Document exists, check for bookings field and add it if not present
        const data = userDoc.data();
        if (!data.bookings) {
          await updateDoc(userDocRef, {
            bookings: [] // Initialize bookings array if it doesn't exist
          });
          console.log('Bookings field added to user document');
        } else {
          console.log('User document already contains bookings field');
        }
      }
  
      // Redirect to a welcome page or home page after successful login
      router.push('/'); // Adjust the route as needed
    } catch (err) {
      console.error('Error logging in:', err);
      setError(err.message); // Set the error message to display
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
            className="w-full bg-green-500 text-white p-3 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
