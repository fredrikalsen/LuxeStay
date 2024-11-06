'use client';

// Import necessary modules
import { useSearchParams } from 'next/navigation'; 
import { parseISO, format } from 'date-fns'; 
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { auth, db } from '../../../../firebaseConfig'; 
import { useRouter } from 'next/navigation'; 

export default function Payment({ params }) {
  const { Id } = params; 
  const searchParams = useSearchParams(); 
  const router = useRouter(); 

  
  const totalPrice = searchParams.get('totalPrice');
  const name = searchParams.get('name');
  const imageUrl = searchParams.get('imageUrl');
  const nights = searchParams.get('nights');
  const pricePerNight = searchParams.get('pricePerNight');
  const cleaningFee = searchParams.get('cleaningFee');
  const serviceFee = searchParams.get('serviceFee');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

 
  const handleReservation = async () => {
    const userId = auth.currentUser.uid; 
    const userDocRef = doc(db, 'users', userId); 

    
    const booking = {
      propertyId: Id, 
      name,
      imageUrl,
      totalPrice,
      checkInDate,
      checkOutDate,
      nights,
      pricePerNight,
      cleaningFee,
      serviceFee,
      createdAt: new Date(), 
    };

    try {
      
      await updateDoc(userDocRef, {
        bookings: arrayUnion(booking), 
      });
      
      
      router.push(`/pages/Booking-confirmation?totalPrice=${totalPrice}&name=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(imageUrl)}&nights=${nights}&pricePerNight=${pricePerNight}&cleaningFee=${cleaningFee}&serviceFee=${serviceFee}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
      
      alert('Reservation confirmed!');
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Error adding booking: ' + error.message); 
    }
  };

  // Format the dates
  const formattedCheckInDate = checkInDate ? format(parseISO(checkInDate), 'MMMM d, yyyy') : '';
  const formattedCheckOutDate = checkOutDate ? format(parseISO(checkOutDate), 'MMMM d, yyyy') : '';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Confirmation Message */}
      <h1 className="text-2xl font-bold mb-6">Your Booking is Confirmed!</h1>
      <p className="mb-4 text-lg">Thank you for choosing us. We look forward to welcoming you!</p>

      {/* Card Section */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        {/* Property Details */}
        <div className="flex items-center mb-4">
          <img src={imageUrl} alt={name} className="w-16 h-16 object-cover rounded-md mr-4" />
          <div>
            <h1 className="text-lg font-semibold">{name}</h1>
            <p className="text-gray-500">Marbella, Spain</p>
          </div>
        </div>

        {/* Date and Guests */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-gray-600">Check-in</p>
            <p className="font-semibold">{formattedCheckInDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Check-out</p>
            <p className="font-semibold">{formattedCheckOutDate}</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-sm font-semibold mb-2">Price details</h2>
          <div className="flex justify-between mb-2">
            <p>€{pricePerNight} x {nights} nights</p>
            <p className="font-semibold">€{pricePerNight * nights}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Cleaning fee</p>
            <p className="font-semibold">€{cleaningFee}</p>
          </div>
          <div className="flex justify-between mb-4">
            <p>Service fee</p>
            <p className="font-semibold">€{serviceFee}</p>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between">
            <p className="font-semibold">Total (EUR)</p>
            <p className="font-semibold">€{totalPrice}</p>
          </div>
        </div>
      </div>

      {/* Return to Home Button */}
      <button
        onClick={() => router.push('/')} // Navigate to the home page
        className="mt-6 w-full max-w-lg bg-blue-500 text-white py-3 rounded-lg shadow-md"
      >
        Return to Home
      </button>
    </div>
  );
}
