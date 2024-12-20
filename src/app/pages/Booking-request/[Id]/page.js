'use client';

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import NavbarDesktop from '../../../components/NavbarDesktop';
import Footer from '../../../components/Footer';
import { useMediaQuery } from 'react-responsive';
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function BookingRequest({ params }) {
  const { Id } = params; 
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0); 
  const [guests, setGuests] = useState(1); 
  const router = useRouter();
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const cleaningFee = 200;
  const serviceFee = 0;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const price = urlParams.get('price');
    const imageUrl = urlParams.get('imageUrl');
    const location = urlParams.get('location');

    setPropertyDetails({ name, price: Number(price), imageUrl, location });
  }, []);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nightsCount = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      setNights(nightsCount);
      const calculatedTotal = nightsCount > 0 ? nightsCount * propertyDetails.price + cleaningFee + serviceFee : 0;
      setTotalPrice(calculatedTotal);
    } else {
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, propertyDetails]);

  const handleConfirmBooking = () => {
    const url = `/pages/Payment/${Id}?totalPrice=${totalPrice}&name=${encodeURIComponent(propertyDetails.name)}&imageUrl=${encodeURIComponent(propertyDetails.imageUrl)}&nights=${nights}&pricePerNight=${propertyDetails.price}&cleaningFee=${cleaningFee}&serviceFee=${serviceFee}&checkInDate=${encodeURIComponent(checkInDate.toISOString())}&checkOutDate=${encodeURIComponent(checkOutDate.toISOString())}&guests=${guests}&location=${encodeURIComponent(propertyDetails.location)}`;
    router.push(url);
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  const { name, price, imageUrl, location } = propertyDetails;

  return (
    <div className="flex flex-col min-h-screen">
      {isDesktop ? <NavbarDesktop /> : <Navbar />}
      <main className="flex-grow bg-gray-100 flex flex-col items-center justify-center p-6">
        {/* Card Section */}
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
          {/* Property Details */}
          <div className="flex items-center mb-4">
            <img src={imageUrl} alt={name} className="w-16 h-16 object-cover rounded-md mr-4" />
            <div>
              <h1 className="text-lg font-semibold">{name}</h1>
              <p className="text-gray-500">{location}</p>
            </div>
          </div>

          {/* Date and Guests */}
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-600">Check-in</p>
              <DatePicker
                selected={checkInDate}
                onChange={date => setCheckInDate(date)}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                className="border rounded p-2 w-full"
                dateFormat="MMMM d, yyyy"
              />
            </div>
            <div>
              <p className="text-gray-600">Check-out</p>
              <DatePicker
                selected={checkOutDate}
                onChange={date => setCheckOutDate(date)}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate}
                className="border rounded p-2 w-full"
                dateFormat="MMMM d, yyyy"
              />
            </div>
          </div>

          {/* Guest Dropdown */}
          <div className="mt-4">
            <label htmlFor="guests" className="block text-gray-600 mb-2">Number of Guests</label>
            <select
              id="guests"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="border rounded p-2 w-full"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h2 className="text-sm font-semibold mb-2">Price details</h2>
            <div className="flex justify-between mb-2">
              <p>€{price} x {nights} nights</p>
              <p className="font-semibold">€{price * nights}</p>
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

        {/* Confirm Button */}
        <button
          className="mt-6 w-full max-w-lg bg-buttonPrimary text-white py-3 rounded-lg shadow-md"
          disabled={totalPrice === 0}
          onClick={handleConfirmBooking}
        >
          Confirm Booking
        </button>
        <button
          className="absolute top-24 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5" /> {/* Heroicons arrow */}
        </button>
      </main>
      {isDesktop && <Footer />}
    </div>
  );
}