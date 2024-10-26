'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebaseConfig'; // Adjust path to your Firebase config
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function Trips() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState(''); // Review text
  const [rating, setRating] = useState(5); // Star rating
  const [reviewerName, setReviewerName] = useState(''); // Reviewer name
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBookings(userData.bookings || []);
        }
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const currentDate = new Date();
    const checkOutDate = new Date(booking.checkOutDate);
    return activeTab === 'upcoming'
      ? checkOutDate > currentDate
      : checkOutDate <= currentDate;
  });

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const submitReview = async () => {
    if (selectedBooking) {
      const propertyDocRef = doc(db, 'properties', selectedBooking.propertyId);
  
      try {
        // Retrieve the current property data, including host and reviews
        const propertyDoc = await getDoc(propertyDocRef);
        if (!propertyDoc.exists()) throw new Error('Property not found');
  
        const propertyData = propertyDoc.data();
        const host = propertyData.host;
        const reviews = propertyData.reviews || [];
  
        // Get the current date for the review
        const reviewDate = new Date();
        const formattedDate = `${reviewDate.getDate()}-${reviewDate.getMonth() + 1}-${reviewDate.getFullYear()}`;
  
        // Add the new review with the created date
        const updatedReviews = [
          ...reviews,
          { name: reviewerName, text: reviewText, rating, createdAt: formattedDate }
        ];
        
        // Calculate the new average rating
        const newAverageRating = (
          updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
          updatedReviews.length
        ).toFixed(1);
  
        // Update Firestore with the new reviews array and updated average rating
        await updateDoc(propertyDocRef, {
          reviews: updatedReviews,
          'host.rating': newAverageRating,
        });
  
        alert('Review submitted successfully!');
        setShowModal(false);
        setReviewText('');
        setRating(5);
        setReviewerName(''); // Clear the name input
        setSelectedBooking(null);
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review: ' + error.message);
      }
    }
  };

  // Function to format the date to display as YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Trips</h1>
      <Navbar />

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
                  Booking Date: {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                </p>
                <h2 className="text-lg font-semibold">{booking.name}</h2>
                <p className="text-sm text-gray-500">Marbella, Spain</p>
              </div>
            </div>
            <div className="flex justify-between">
              {activeTab === 'done' && (
                <button
                  onClick={() => handleReviewClick(booking)}
                  className="bg-gray-200 text-black py-2 px-4 rounded-md"
                >
                  Write a Review
                </button>
              )}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Write a Review
            </h2>
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setRating(index + 1)}
                  className={`cursor-pointer ${index < rating ? 'text-yellow-500 text-4xl' : 'text-gray-300 text-4xl'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your Name"
              className="w-full border rounded-md p-2 mb-4"
            />
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-md p-2 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-black py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="bg-black text-white py-2 px-4 rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
