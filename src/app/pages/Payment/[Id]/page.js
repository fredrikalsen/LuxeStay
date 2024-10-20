// luxestay/src/app/pages/Payment/[Id]/page.js
'use client'
export default function Payment({ params, searchParams }) {
  const { Id } = params; // Get the ID from the route params
  const { totalPrice, name, imageUrl } = searchParams; // Get other details from search params

  const handleReservation = () => {
    // Logic for reserving the property (e.g., making an API call)
    alert('Reservation confirmed!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold">Payment for {name}</h1>
      <div className="mt-4">
        <img src={imageUrl} alt={name} className="w-48 h-48 object-cover" />
      </div>
     
      <p className="mt-2">Total Price: {totalPrice}€</p>
      <button
        onClick={handleReservation}
        className="mt-4 w-full bg-green-500 text-white p-3 rounded-lg"
      >
        Reserve Now
      </button>
    </div>
  );
}
