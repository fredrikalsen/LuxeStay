"use client";

import { useState } from "react";
import { login } from "../../auth/auth"; // Adjust the path as needed
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/"); // Redirect to home after successful login
    } catch (err) {
      // Check the error code for specific Firebase authentication errors
      if (err.code === "auth/user-not-found") {
        setError("User not found. Please register first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("An error occurred. Please try again."); // Generic error message for other errors
      }
    }
  };

  const handleRegisterRedirect = () => {
    router.push("/pages/register"); // Redirect to the registration page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="border rounded w-full p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="border rounded w-full p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? 
          <button 
            onClick={handleRegisterRedirect} 
            className="text-blue-500 underline ml-1">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
