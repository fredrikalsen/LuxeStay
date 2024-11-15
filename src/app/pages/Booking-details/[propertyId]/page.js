'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { auth } from '../../../../../firebaseConfig';
import Navbar from '../../../components/Navbar';
import NavbarDesktop from '../../../components/NavbarDesktop';

const BookingDetails = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const propertyId = params.propertyId;
  const bookingId = searchParams.get('bookingId');
  const checkInDate = searchParams.get('checkInDate')?.split(' ')[0];
  const checkOutDate = searchParams.get('checkOutDate')?.split(' ')[0];
  const cleaningFee = searchParams.get('cleaningFee');
  const imageUrl = searchParams.get('imageUrl');
  const name = searchParams.get('name');
  const nights = searchParams.get('nights');
  const pricePerNight = searchParams.get('pricePerNight');
  const serviceFee = searchParams.get('serviceFee');
  const totalPrice = searchParams.get('totalPrice');
  const guests = searchParams.get('guests') || '10'; // Default to 10 if not provided

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isDesktop ? (
        <NavbarDesktop user={auth.currentUser} />
      ) : (
        <Navbar />
      )}
      
      {/* Add top padding to push the content below the navbar */}
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 space-y-4 mt-6 md:mt-4">
        <img src={imageUrl} alt={name} className="w-full h-52 object-cover rounded-lg" />

        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-700">You’re going to</h2>
          <p className="text-xl font-semibold text-blue-600">{name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div className="text-center">
            <p className="text-sm font-medium">Check-in</p>
            <p className="text-sm font-light">{checkInDate}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Check-out</p>
            <p className="text-sm font-light">{checkOutDate}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div className="text-center">
            <p className="text-sm font-medium">Stay Duration</p>
            <p className="text-sm font-light">{nights} Nights</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Guests</p>
            <p className="text-sm font-light">{guests} Guests</p>
          </div>
        </div>

        <div className="space-y-1 text-center">
          <h3 className="text-gray-800 font-semibold">Address</h3>
          <p className="text-sm text-gray-600">Buceara Villa El Nido</p>
          <p className="text-sm text-gray-600">Cascada de Camojan, Marbella</p>
          <p className="text-sm text-gray-600">29602, Málaga, Spain</p>
          <div className="flex justify-center space-x-4 text-blue-600 text-sm font-medium mt-2">
            <button>View on map</button>
            <button>View listing</button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-gray-800 font-semibold">Price Breakdown</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Nightly Rate:</span> <span>€{pricePerNight}/night</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Cleaning Fee:</span> <span>€{cleaningFee}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Service Fee:</span> <span>€{serviceFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 mt-2">
            <span>Total Price:</span> <span>€{totalPrice}</span>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default BookingDetails;
