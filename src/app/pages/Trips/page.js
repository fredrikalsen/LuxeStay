'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import NavbarDesktop from '../../components/NavbarDesktop';

export default function Trips() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // Adjust threshold as needed
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setBookings(userDoc.data().bookings || []);
        }
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const currentDate = new Date();
    const checkOutDate = new Date(booking.checkOutDate);
    return activeTab === 'upcoming' ? checkOutDate > currentDate : checkOutDate <= currentDate;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const cancelBooking = async (booking) => {
    const userId = auth.currentUser?.uid;
    if (userId && booking) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          bookings: arrayRemove(booking),
        });
        setBookings((prevBookings) => prevBookings.filter((b) => b.propertyId !== booking.propertyId));
        alert("Booking canceled successfully.");
      } catch (error) {
        console.error("Error canceling booking: ", error);
        alert("There was an error canceling your booking.");
      }
    }
  };

  const submitReview = async () => {
    if (selectedBooking && reviewText.trim() && reviewerName.trim()) {
      try {
        const propertyId = selectedBooking.propertyId;
        const propertyDocRef = doc(db, 'properties', propertyId);
  
        // Prepare the review data in the desired format
        const newReview = {
          createdAt: new Date().toLocaleDateString('en-GB'),
          name: reviewerName,
          rating: rating,
          text: reviewText,
        };
  
        // Start a transaction to ensure atomic updates
        await updateDoc(propertyDocRef, {
          reviews: arrayUnion(newReview), // Append the new review
        });
  
        // Fetch updated property document to calculate new average rating
        const propertyDoc = await getDoc(propertyDocRef);
        if (propertyDoc.exists()) {
          const propertyData = propertyDoc.data();
          const reviews = propertyData.reviews || [];
          
          // Calculate the new average rating
          const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0) + rating;
          const averageRating = (totalRatings / (reviews.length + 1)).toFixed(1);
  
          // Update the host's rating with the new average
          await updateDoc(propertyDocRef, {
            'host.rating': averageRating
          });
        }
  
        // Reset the review form
        setShowModal(false);
        setReviewText('');
        setReviewerName('');
        setRating(5);
  
        alert("Review submitted successfully!");
  
      } catch (error) {
        console.error("Error submitting review: ", error);
        alert("There was an error submitting your review.");
      }
    } else {
      alert("Please fill in all review fields.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isDesktop ? <NavbarDesktop /> : <Navbar />}
      <div className="flex flex-col items-center p-6 flex-grow">
        <h1 className="text-2xl font-semibold text-center mb-6">Trips</h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-l-full ${activeTab === 'upcoming' ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('done')}
            className={`px-4 py-2 rounded-r-full ${activeTab === 'done' ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}
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
                  <p className="text-sm font-semibold">Booking ID: {booking.bookingId}</p>
                  <p className="text-sm text-gray-500">
                    Booking Date: {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  </p>
                  <h2 className="text-lg font-semibold">{booking.name}</h2>
                  <p className="text-sm text-gray-500">Marbella, Spain</p>
                </div>
              </div>
              <div className="flex justify-between">
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => cancelBooking(booking)}
                    className="bg-gray-400 text-white py-2 px-4 rounded-md"
                  >
                    Cancel
                  </button>
                )}
                {activeTab === 'done' && (
                  <button
                    onClick={() => handleReviewClick(booking)}
                    className="bg-gray-200 text-black py-2 px-4 rounded-md"
                  >
                    Write a Review
                  </button>
                )}
<button
  onClick={() => {
    const query = new URLSearchParams({
      bookingId: booking.bookingId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      cleaningFee: booking.cleaningFee,
      createdAt: booking.createdAt,
      imageUrl: booking.imageUrl,
      name: booking.name,
      nights: booking.nights,
      pricePerNight: booking.pricePerNight,
      propertyId: booking.propertyId,
      serviceFee: booking.serviceFee,
      totalPrice: booking.totalPrice,
      location: 'Marbella, Spain' // Assuming location is static or you can replace it with dynamic value
    }).toString();
    router.push(`/pages/Booking-details/${booking.propertyId}?${query}`);
  }}
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
              <h2 className="text-lg font-semibold mb-4 text-center">Write a Review</h2>
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
    </div>
  );
}