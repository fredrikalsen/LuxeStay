'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebaseConfig'; // Adjust path to your Firebase config
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore'; // Firestore functions
import { useRouter } from 'next/navigation'; // For navigation
import Navbar from '../../components/Navbar';

export default function Trips() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'done'
  const [selectedBooking, setSelectedBooking] = useState(null); // Track the booking to cancel
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const router = useRouter(); // For redirecting to details page

  // Fetch user bookings from Firestore
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = auth.currentUser?.uid; // Check if the user is logged in
      if (userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBookings(userData.bookings || []); // Set bookings from Firestore
        }
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings based on activeTab
  const filteredBookings = bookings.filter((booking) => {
    const currentDate = new Date();
    const checkOutDate = new Date(booking.checkOutDate);
    return activeTab === 'upcoming'
      ? checkOutDate > currentDate
      : checkOutDate <= currentDate;
  });

  // Open the modal for cancel confirmation
  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true); // Show confirmation modal
  };

  // Handle booking cancellation
  const handleCancelBooking = async () => {
    if (selectedBooking) {
      const userId = auth.currentUser?.uid;
      const userDocRef = doc(db, 'users', userId);

      try {
        // Remove booking from Firestore using arrayRemove
        await updateDoc(userDocRef, {
          bookings: arrayRemove(selectedBooking),
        });

        // Update local state after deletion
        setBookings((prevBookings) =>
          prevBookings.filter((b) => b !== selectedBooking)
        );

        alert('Booking cancelled successfully!');
        setShowModal(false); // Close modal after cancellation
        setSelectedBooking(null); // Clear selected booking
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Trips</h1>
      <Navbar />

      {/* Tab Switcher */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-l-full ${
            activeTab === 'upcoming'
              ? 'bg-black text-white'
              : 'bg-gray-300 text-black'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('done')}
          className={`px-4 py-2 rounded-r-full ${
            activeTab === 'done'
              ? 'bg-black text-white'
              : 'bg-gray-300 text-black'
          }`}
        >
          Done
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center mb-4">
              <img
                src={booking.imageUrl}
                alt={booking.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div>
                <p className="text-sm font-semibold">Booking ID: {index + 1}</p>
                <p className="text-sm text-gray-500">
                  Booking Date: {booking.checkInDate} - {booking.checkOutDate}
                </p>
                <h2 className="text-lg font-semibold">{booking.name}</h2>
                <p className="text-sm text-gray-500">Marbella, Spain</p>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => handleCancelClick(booking)}
                className="bg-gray-200 text-black py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => router.push(`/trips/${booking.propertyId}`)}
                className="bg-black text-white py-2 px-4 rounded-md"
              >
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No {activeTab} trips.</p>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to cancel your reservation?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)} // Close modal on "Keep Reservation"
                className="bg-gray-200 text-black py-2 px-4 rounded-md"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelBooking} // Proceed with cancellation
                className="bg-black text-white py-2 px-4 rounded-md"
              >
                Cancel Reservation
              </button>
              
            </div>     
          </div>   
        </div>
        
      )}
    </div>
  );
}
