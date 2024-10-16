"use client";

import { useEffect, useState } from "react";
import { auth } from '../../../../firebaseConfig'; // Adjust the path as needed
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { logout } from "../../auth/auth"; // Adjust the path as needed

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleLogout = async () => {
    await logout(); // Call the logout function
    router.push("/login"); // Redirect to login page after logout
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {user ? (
          <>
            <p className="text-lg">Email: {user.email}</p>
            {/* Add more user information if needed */}
            {/* Example: <p>Name: {user.displayName}</p> */}
          </>
        ) : (
          <p>No user data found.</p>
        )}
        <button 
          className="mt-4 bg-blue-500 text-white p-2 rounded" 
          onClick={() => router.push('/')} // Redirect to home
        >
          Go to Home
        </button>
        <button 
          className="mt-4 bg-red-500 text-white p-2 rounded" 
          onClick={handleLogout} // Logout on button click
        >
          Logout
        </button>
      </div>
    </div>
  );
}
