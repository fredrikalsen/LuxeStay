'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseISO, format } from 'date-fns';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../firebaseConfig';
import { useRouter } from 'next/navigation';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import Navbar from '../../../components/Navbar';
import NavbarDesktop from '../../../components/NavbarDesktop';
import Footer from '../../../components/Footer';
import { useMediaQuery } from 'react-responsive';

export default function Payment({ params }) {
  const { Id } = params;
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // Extract query parameters
  const totalPrice = searchParams.get('totalPrice');
  const name = searchParams.get('name');
  const imageUrl = searchParams.get('imageUrl');
  const nights = searchParams.get('nights');
  const pricePerNight = searchParams.get('pricePerNight');
  const cleaningFee = searchParams.get('cleaningFee');
  const serviceFee = searchParams.get('serviceFee');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const methods = userDoc.data().paymentMethods || [];
          setPaymentMethods(methods);
          setSelectedPaymentMethod(methods[0]); // Select the first method by default
        }
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleReservation = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId || !selectedPaymentMethod) {
      alert('Please log in and select a payment method to proceed.');
      return;
    }

    // Create a unique booking ID
    const bookingId = uuidv4();

    const booking = {
      bookingId, // Include the booking ID
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

    const userDocRef = doc(db, 'users', userId);

    try {
      await updateDoc(userDocRef, {
        bookings: arrayUnion(booking),
      });

      router.push(`/pages/Booking-confirmation?totalPrice=${totalPrice}&name=${encodeURIComponent(name)}&imageUrl=${encodeURIComponent(imageUrl)}&nights=${nights}&pricePerNight=${pricePerNight}&cleaningFee=${cleaningFee}&serviceFee=${serviceFee}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
      
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Error adding booking: ' + error.message);
    }
  };

  const formattedCheckInDate = checkInDate ? format(parseISO(checkInDate), 'MMMM d, yyyy') : '';
  const formattedCheckOutDate = checkOutDate ? format(parseISO(checkOutDate), 'MMMM d, yyyy') : '';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    closeModal();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isDesktop ? <NavbarDesktop /> : <Navbar />}
      <main className="flex-grow bg-gray-100 flex flex-col items-center justify-center p-6">
        {/* Booking Details */}
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <img src={imageUrl} alt={name} className="w-16 h-16 object-cover rounded-md mr-4" />
            <div>
              <h1 className="text-lg font-semibold">{name}</h1>
              <p className="text-gray-500">Marbella, Spain</p>
            </div>
          </div>

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

        {/* Payment Method Section */}
        <div className="w-full max-w-lg p-4 mt-6">
          <h2 className="text-sm font-semibold mb-4">Payment method</h2>
          <div className="flex justify-between items-center">
            {selectedPaymentMethod ? (
              <>
                <div className="flex items-center">
                  {selectedPaymentMethod.cardType === 'Visa' && <FaCcVisa className="text-blue-600 text-2xl mr-2" />}
                  {selectedPaymentMethod.cardType === 'MasterCard' && <FaCcMastercard className="text-red-600 text-2xl mr-2" />}
                  <p>{selectedPaymentMethod.cardType} {selectedPaymentMethod.cardNumber}</p>
                </div>
                <button
                  onClick={openModal}
                  className="text-textPrimary"
                >
                  Change
                </button>
              </>
            ) : (
              <>
                <p>No payment method selected</p>
                <button
                  onClick={() => router.push('/pages/payments')}
                  className="mt-4 text-blue-500 underline"
                >
                  Add a payment method
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reserve Button */}
        <button
          onClick={handleReservation}
          className="mt-6 w-full max-w-lg bg-buttonPrimary text-white py-3 rounded-lg shadow-md"
        >
          Reserve
        </button>
        <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg" onClick={() => router.back()}>
          Back
        </button>
      </main>
      {isDesktop && <Footer />}

      {/* Modal for Selecting Payment Method */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Select Payment Method</h2>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectPaymentMethod(method)}
                  className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    {method.cardType === 'Visa' && <FaCcVisa className="text-blue-600 text-2xl mr-2" />}
                    {method.cardType === 'MasterCard' && <FaCcMastercard className="text-red-600 text-2xl mr-2" />}
                    <p>{method.cardType} {method.cardNumber}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No payment methods available</p>
            )}
            <button className="mt-4 w-full bg-buttonPrimary text-white py-2 rounded-lg" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}