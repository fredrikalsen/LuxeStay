'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { ArrowLeftIcon } from '@heroicons/react/outline';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function PropertyDetails({ params }) {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const { Id } = params;

  useEffect(() => {
    const fetchProperty = async () => {
      const docRef = doc(db, 'properties', Id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProperty(docSnap.data());
      } else {
        console.error('No such property!');
      }
    };

    fetchProperty();
  }, [Id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-${i <= rating ? 'yellow-500' : 'gray-300'}`}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  const position = [property.map_location.lat, property.map_location.lng];

  const handleRequest = () => {
    const url = `/pages/Booking-request/${Id}?name=${encodeURIComponent(property.name)}&price=${property.price}&imageUrl=${encodeURIComponent(property.imageUrl || '/placeholder.jpg')}`;
    router.push(url);
  };

  return (
    <div className="bg-gray-100">
      {/* Property Image */}
      <div className="relative mb-8">
        <img
          src={property.imageUrl || '/placeholder.jpg'}
          alt={property.name}
          className="w-full h-[500px] object-cover"
        />
        <button
          className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center font-semibold"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" /> {/* Heroicons arrow */}
         
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Details */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
          <p className="text-gray-500">{property.location.city}, {property.location.country}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-2">{property.price}€ / night</p>
          <p className="text-gray-600 mt-2">{property.guests} guests • {property.bedrooms} bedrooms • {property.beds} beds • {property.bathrooms} bathrooms</p>
          <div className="flex items-center mt-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-semibold">
              {property.host.name.charAt(0)}
            </div>
            <p className="ml-4 text-gray-800">Hosted by {property.host.name} ({renderStars(property.host.rating)})</p>
          </div>
          <p className="text-gray-700 mt-4">{property.description}</p>
        </div>

        {/* Booking & Price Details */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
        <p className="text-gray-500">{property.location.city}, {property.location.country}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-2">{property.price}€ / night</p>
          <p className="text-gray-600 mt-2">{property.guests} guests • {property.bedrooms} bedrooms • {property.beds} beds • {property.bathrooms} bathrooms</p>
          <button
            className="w-full bg-accent text-white p-3 rounded-lg font-semibold mt-4"
            onClick={handleRequest}
          >
            Request
          </button>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Map */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Where you'll be</h3>
          <div className="mt-4 h-96 w-full rounded-lg overflow-hidden">
            {typeof window !== 'undefined' && (
              <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={position}>
                  <Popup>{property.name}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>

        {/* Safety */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Safety</h3>
          {property.safety.private_entrance && <p>✔ Private entrance</p>}
          {property.safety.smoke_detector && <p>✔ Smoke detector</p>}
        </div>

        {/* Property Features */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Property features</h3>
          <ul className="mt-4 space-y-2">
            {property.property_features.pool && <li>✔ Pool</li>}
            {property.property_features.garden_view && <li>✔ Garden view</li>}
            {property.property_features.gym && <li>✔ Gym</li>}
            {property.property_features.beach_view && <li>✔ Beach view</li>}
            {property.property_features.helicopter_pad && <li>✔ Helicopter pad</li>}
            {property.property_features.parking && <li>✔ Parking</li>}
            {property.property_features.fireplace && <li>✔ Fireplace</li>}
            {property.property_features.mountain_view && <li>✔ Mountain view</li>}
            {property.property_features.balcony && <li>✔ Balcony</li>}
            {property.property_features.city_view && <li>✔ City view</li>}
            {property.property_features.overwater_bungalow && <li>✔ Overwater bungalow</li>}
          </ul>
        </div>

        {/* Services */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Services</h3>
          {property.services.private_chef ? <p>✔ Private chef available</p> : <p>No private chef service</p>}
          {property.services.laundry && <p>✔ Laundry service</p>}
          {property.services.spa && <p>✔ Spa</p>}
          {property.services.ski_rentals && <p>✔ Ski rentals</p>}
        </div>

        {/* Reviews */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg">Reviews</h3>
          {property.reviews && property.reviews.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 mt-4">
              {property.reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="min-w-[250px] border p-4 rounded-lg shadow-sm flex-shrink-0">
                  <p className="font-semibold">{review.name}</p> 
                  <p className="text-gray-500">{review.createdAt}</p>
                  <p className="mt-2">{review.text}</p>
                  <div className="flex mt-1">{renderStars(review.rating)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      </div>
    </div>
  );
}