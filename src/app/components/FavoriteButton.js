import React from 'react';
import { db } from '../../firebaseConfig'; 
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const FavoriteButton = ({ userId, propertyId }) => {
  const handleFavorite = async () => {
    if (!userId) {
      alert("Please log in to favorite properties.");
      return;
    }

    const userRef = doc(db, 'users', userId);
    
    try {
      await updateDoc(userRef, {
        favorites: arrayUnion(propertyId),
      });
      alert('Property added to favorites!');
    } catch (error) {
      console.error("Error adding favorite: ", error);
    }
  };

  return (
    <button onClick={handleFavorite} className="bg-blue-500 text-white px-4 py-2 rounded">
      Favorite
    </button>
  );
};

export default FavoriteButton;
