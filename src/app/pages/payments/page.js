'use client';

// Import necessary modules
import { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebaseConfig';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardType, setCardType] = useState('Visa');
  const [cardNumber, setCardNumber] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setPaymentMethods(userDoc.data().paymentMethods || []);
        }
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleAddPaymentMethod = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert('Please log in to add a payment method.');
      return;
    }

    if (!cardNumber || cardNumber.length !== 4) {
      alert('Please enter the last 4 digits of the card number.');
      return;
    }

    const newPaymentMethod = {
      cardType,
      cardNumber: `**** **** **** ${cardNumber}`,
    };

    const userDocRef = doc(db, 'users', userId);

    try {
      await updateDoc(userDocRef, {
        paymentMethods: arrayUnion(newPaymentMethod),
      });
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      setIsModalOpen(false);
      setCardNumber('');
      alert('Payment method added successfully!');
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-6">Payment Method</h1>

      {/* Payment Methods List */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 mb-6">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">
                  {method.cardType === 'MasterCard' ? '💳' : '💳'}
                </span>
                <p className="font-semibold">{method.cardType} {method.cardNumber}</p>
              </div>
              <button className="text-gray-500">➔</button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-3">No payment methods added.</p>
        )}
      </div>

      {/* Add Payment Method Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-black text-white py-3 px-6 rounded-lg shadow-md w-full max-w-lg text-center"
      >
        Add Payment Method
      </button>
      <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg" onClick={() => router.back()}>
        Back
      </button>

      {/* Modal for Adding Payment Method */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Add Payment Method</h2>
            <label className="block text-gray-700 mb-2">Card Type</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
            </select>

            <label className="block text-gray-700 mb-2">Last 4 Digits of Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength="4"
              placeholder="1234"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPaymentMethod}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
