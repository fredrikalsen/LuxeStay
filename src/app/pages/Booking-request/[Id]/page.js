'use client';

import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';

export default function BookingRequest({ params }) {
  const { Id } = params; // Get the dynamic ID from the params
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const price = urlParams.get('price');
    const imageUrl = urlParams.get('imageUrl');

    setPropertyDetails({ name, price: Number(price), imageUrl });
  }, []);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const calculatedTotal = nights > 0 ? nights * propertyDetails.price : 0;
      setTotalPrice(calculatedTotal);
    } else {
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, propertyDetails]);

  const handleConfirmBooking = () => {
    const url = `/pages/Payment/${Id}?totalPrice=${totalPrice}&name=${encodeURIComponent(propertyDetails.name)}&imageUrl=${encodeURIComponent(propertyDetails.imageUrl)}`;
    router.push(url);
  };

  if (!propertyDetails) {
    return <div>Loading...</div>;
  }

  const { name, price, imageUrl } = propertyDetails;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold">Booking Request</h1>
      <div className="mt-4">
        <img src={imageUrl} alt={name} className="w-48 h-48 object-cover" />
      </div>
      <p className="mt-2">Property Name: {name}</p>
      <p className="mt-2">Price: {price}€ per night</p>

      <div className="mt-4">
        <label className="block mb-2">Check-in Date:</label>
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
      <div className="mt-4">
        <label className="block mb-2">Check-out Date:</label>
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

      <div className="mt-4">
        <p className="font-semibold">Total Price: {totalPrice}€</p>
      </div>

      <button
        className="mt-4 w-full bg-green-500 text-white p-3 rounded-lg"
        disabled={totalPrice === 0}
        onClick={handleConfirmBooking}
      >
        Confirm Booking
      </button>
    </div>
  );
}
