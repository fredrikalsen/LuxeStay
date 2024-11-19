"use client";

import { useEffect, useState } from "react";
import { auth } from '../../../../firebaseConfig'; 
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { logout } from "../../auth/auth"; 
import Navbar from "../../components/Navbar";
import NavbarDesktop from "../../components/NavbarDesktop";
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); 
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
        router.push("/login"); 
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/pages/login"); 
  };

  if (loading) {
    return <div>Loading...</div>; 
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
    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-300 text-white text-4xl font-bold mb-4">
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile picture"
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <span>{user?.email?.charAt(0).toUpperCase() || "A"}</span>
      )}
    </div>
    <h2 className="text-xl font-bold mt-2">{user?.email || "Anonymous User"}</h2>
  </div>
</div>

  <button
  className="absolute top-15 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
  onClick={() => router.back()}
  >
  <ArrowLeftIcon className="w-5 h-5" /> 
  </button>

        {/* Account Settings Section */}
        <div className="w-full max-w-screen-lg bg-white mt-6 shadow-sm">
          <h3 className="p-4 text-gray-600 font-semibold">Account settings</h3>
          <div className="border-t border-gray-300"></div>
          <button className="w-full p-4 flex justify-between items-center text-gray-700" onClick={() => router.push('/pages/personal-information')}>
            <span>Personal information</span>
            <span>&#x279C;</span>
          </button>
          <div className="border-t border-gray-300"></div>
          <button 
            className="w-full p-4 flex justify-between items-center text-gray-700"
            onClick={() => router.push('/pages/payments')}
          >
            <span>Payments</span>
            <span>&#x279C;</span>
          </button>
        </div>

        {/* Law Section */}
        <div className="w-full max-w-screen-lg bg-white mt-6 shadow-sm">
  <h3 className="p-4 text-gray-600 font-semibold">Law</h3>
  <div className="border-t border-gray-300"></div>
  <button 
    className="w-full p-4 flex justify-between items-center text-gray-700"
    onClick={() => router.push('/pages/terms')}
  >
    <span>Terms and services</span>
    <span>&#x279C;</span>
  </button>
  <div className="border-t border-gray-300"></div>
  <button 
    className="w-full p-4 flex justify-between items-center text-gray-700"
    onClick={() => router.push('/pages/privacy')}
  >
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