'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../../firebaseConfig';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cardType, setCardType] = useState('Visa');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
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

  const handleAddOrUpdatePaymentMethod = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert('Please log in to manage your payment methods.');
      return;
    }

    if (!cardNumber || !expiryDate || !cvc || !nameOnCard) {
      alert('Please fill in all fields.');
      return;
    }

    const newPaymentMethod = {
      cardType,
      nameOnCard,
      cardNumber: `**** **** **** ${cardNumber.slice(-4)}`,
      expiryDate,
    };

    const userDocRef = doc(db, 'users', userId);

    try {
      if (isEditMode && selectedPaymentMethod) {
        // Remove the old payment method
        await updateDoc(userDocRef, {
          paymentMethods: arrayRemove(selectedPaymentMethod),
        });
        // Add the updated payment method
        await updateDoc(userDocRef, {
          paymentMethods: arrayUnion(newPaymentMethod),
        });

        const updatedMethods = paymentMethods.map((method) =>
          method === selectedPaymentMethod ? newPaymentMethod : method
        );
        setPaymentMethods(updatedMethods);
      } else {
        // Add new payment method
        await updateDoc(userDocRef, {
          paymentMethods: arrayUnion(newPaymentMethod),
        });
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
      }

      // Reset modal state
      setIsModalOpen(false);
      resetModal();
      alert(isEditMode ? 'Payment method updated successfully!' : 'Payment method added successfully!');
    } catch (error) {
      console.error('Error managing payment method:', error);
      alert('Failed to manage payment method.');
    }
  };

  const resetModal = () => {
    setCardType('Visa');
    setNameOnCard('');
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    setIsEditMode(false);
    setSelectedPaymentMethod(null);
  };

  const handleEdit = (method) => {
    setIsEditMode(true);
    setSelectedPaymentMethod(method);
    setCardType(method.cardType);
    setNameOnCard(method.nameOnCard);
    setCardNumber('');
    setExpiryDate(method.expiryDate);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-xl font-semibold mb-6">Payment Methods</h1>

      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 mb-6">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">💳</span>
                <p className="font-semibold">{method.cardType} {method.cardNumber}</p>
              </div>
              <button
                onClick={() => handleEdit(method)}
                className="text-gray-500 hover:text-black"
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-3">No payment methods added.</p>
        )}
      </div>

      <button
        onClick={() => {
          setIsModalOpen(true);
          resetModal();
        }}
        className="bg-black text-white py-3 px-6 rounded-lg shadow-md w-full max-w-lg text-center"
      >
        Add Payment Method
      </button>
      <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg" onClick={() => router.back()}>
        Back
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">{isEditMode ? 'Edit Payment Method' : 'Credit / Debit Card'}</h2>
            <div className="bg-gradient-to-r from-purple-400 to-blue-500 p-4 rounded-lg mb-6 text-white">
              <p className="text-xl">{cardNumber ? `**** **** **** ${cardNumber.slice(-4)}` : '**** **** **** ****'}</p>
              <p className="text-lg uppercase">{nameOnCard || 'YOUR NAME'}</p>
              <p>{expiryDate || 'MM/YY'}</p>
            </div>
            <label className="block text-gray-700 mb-2">Name on card</label>
            <input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <label className="block text-gray-700 mb-2">Card number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              maxLength="4"
              placeholder="4 last digits"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <label className="block text-gray-700 mb-2">Expiry date</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <label className="block text-gray-700 mb-2">CVC</label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              maxLength="3"
              placeholder="123"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetModal();
                }}
                className="text-gray-500 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdatePaymentMethod}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {isEditMode ? 'Save Changes' : 'Use This Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
