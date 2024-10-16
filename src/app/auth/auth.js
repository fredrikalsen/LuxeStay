import { auth } from '../../../firebaseConfig'; // Adjust the path as needed
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const signUp = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up successfully');
  } catch (error) {
    // Propagate the error to be handled in the UI
    throw new Error(error.message);
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in successfully');
  } catch (error) {
    // Propagate the error to be handled in the UI
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    // Propagate the error to be handled in the UI
    throw new Error(error.message);
  }
};
