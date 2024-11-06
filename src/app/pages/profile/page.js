"use client";

import { useEffect, useState } from "react";
import { auth } from '../../../../firebaseConfig'; // Adjust the path as needed
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { logout } from "../../auth/auth"; // Ensure the path is correct
import Navbar from "../../components/Navbar";
import NavbarDesktop from "../../components/NavbarDesktop";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // Adjust threshold as needed
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redirect to login if user is not authenticated
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/pages/login"); // Redirect to login page after logout
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Conditional rendering of Navbar */}
      {isDesktop ? <NavbarDesktop /> : <Navbar />}

      {/* Full-width wrapper */}
      <div className="flex-grow flex flex-col items-center w-full p-5">
        {/* Profile Header */}
        <div className="w-full max-w-screen-lg bg-white p-4 shadow-md">
          <div className="flex flex-col items-center">
            <img 
              src={user?.photoURL || '/avatar.jpg'} 
              alt="Profile picture" 
              className="w-24 h-24 rounded-full object-cover mb-4" 
            />
            <h2 className="text-xl font-bold">{user?.email || "Anonymous User"}</h2>
          </div>
        </div>

        <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg" onClick={() => router.back()}>
          Back
        </button>

        {/* Account Settings Section */}
        <div className="w-full max-w-screen-lg bg-white mt-6 shadow-sm">
          <h3 className="p-4 text-gray-600 font-semibold">Account settings</h3>
          <div className="border-t border-gray-300"></div>
          <button className="w-full p-4 flex justify-between items-center text-gray-700">
            <span>Personal information</span>
            <span>&#x279C;</span>
          </button>
          <div className="border-t border-gray-300"></div>
          <button className="w-full p-4 flex justify-between items-center text-gray-700">
            <span>Payments</span>
            <span>&#x279C;</span>
          </button>
        </div>

        {/* Law Section */}
        <div className="w-full max-w-screen-lg bg-white mt-6 shadow-sm">
          <h3 className="p-4 text-gray-600 font-semibold">Law</h3>
          <div className="border-t border-gray-300"></div>
          <button className="w-full p-4 flex justify-between items-center text-gray-700">
            <span>Terms and services</span>
            <span>&#x279C;</span>
          </button>
          <div className="border-t border-gray-300"></div>
          <button className="w-full p-4 flex justify-between items-center text-gray-700">
            <span>Privacy policy</span>
            <span>&#x279C;</span>
          </button>
        </div>

        {/* Sign Out Button */}
        <button 
          className="text-red-500 mt-6 underline"
          onClick={handleLogout}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
