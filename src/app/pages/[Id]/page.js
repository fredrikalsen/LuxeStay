'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig'; // Adjust path to your Firebase configuration

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issues with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function PropertyDetails({ params }) {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const { Id } = params; // Get the property ID from the URL parameters

  // Fetch property data from Firebase based on an ID
  useEffect(() => {
    const fetchProperty = async () => {
      const docRef = doc(db, 'properties', Id); // Fetch property by ID
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProperty(docSnap.data());
      } else {
        console.error('No such property!');
      }
    };

    fetchProperty();
  }, [Id]);

  if (!property) {
    return <div>Loading...</div>; // Loading state while fetching data
  }

  const position = [property.map_location.lat, property.map_location.lng]; // Ensure these values are numbers

  return (
    <div className="relative min-h-screen pb-16">
      {/* Property Image */}
      <div className="relative">
        <img
          src={property.imageUrl || '/placeholder.jpg'}
          alt={property.name}
          className="w-full h-64 object-cover"
        />
        <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg" onClick={() => router.back()}>
          Back
        </button>
      </div>

      {/* Property Details */}
      <div className="p-6 bg-white">
        {/* Property Name, Location, Price */}
        <h1 className="text-2xl font-semibold">{property.name}</h1>
        <p className="text-gray-600">{property.location.city}, {property.location.country}</p>
        <p className="text-xl font-bold mt-2">{property.price}€ / night</p>
        <p className="text-sm text-gray-600">{property.guests} guests · {property.bedrooms} bedrooms · {property.bathrooms} bathrooms</p>

        {/* Host Information */}
        <div className="flex items-center mt-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {/* Host Avatar Placeholder */}
          </div>
          <p className="ml-2">Hosted by {property.host.name} (Rating: {property.host.rating})</p>
        </div>

        {/* Property Description */}
        <p className="mt-4">{property.description}</p>

        {/* Request Button */}
        <button className="mt-4 w-full bg-green-500 text-white p-3 rounded-lg">
          Request
        </button>
      </div>

      {/* Map */}
      <div className="p-6 bg-white">
        <h3 className="font-semibold text-lg">Where you'll be</h3>
        <div className="mt-4">
          {/* Leaflet Implementation */}
          <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                {property.name}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* What this place offers */}
      <div className="p-6 bg-white">
        <h3 className="font-semibold text-lg">What this place offers</h3>
        <ul className="mt-4 space-y-2">
          {property.offers.wifi && <li>✔ Wifi</li>}
          {property.offers.kitchen && <li>✔ Kitchen</li>}
          {!property.offers.no_parking && <li>✔ Parking available</li>}
          {property.offers.pets_allowed && <li>✔ Pets allowed</li>}
        </ul>
      </div>

      {/* House Rules */}
      <div className="p-6 bg-white">
        <h3 className="font-semibold text-lg">House rules</h3>
        <p>Check-in: {property.house_rules.check_in}</p>
        <p>Check-out: {property.house_rules.check_out}</p>
        {property.house_rules.no_smoking && <p>✔ No smoking</p>}
        {!property.house_rules.security_services && <p>No security services</p>}
      </div>

      {/* Safety */}
      <div className="p-6 bg-white">
        <h3 className="font-semibold text-lg">Safety</h3>
        {property.safety.private_entrance && <p>✔ Private entrance</p>}
        {property.safety.smoke_detector && <p>✔ Smoke detector</p>}
      </div>

      {/* Property Features */}
      <div className="p-6 bg-white">
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
          {/* Add other features as needed */}
        </ul>
      </div>

      {/* Services */}
      <div className="p-6 bg-white">
        <h3 className="font-semibold text-lg">Services</h3>
        {property.services.private_chef ? <p>✔ Private chef available</p> : <p>No private chef service</p>}
        {property.services.laundry && <p>✔ Laundry service</p>}
        {property.services.spa && <p>✔ Spa</p>}
        {property.services.ski_rentals && <p>✔ Ski rentals</p>}
      </div>
    </div>
  );
}
