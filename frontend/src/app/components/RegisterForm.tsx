"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(""); 

    try {
      // YOUR TURN! Write the registration logic here.
      // 1. Write the fetch() call to POST to your /api/users route.
      // 2. The body needs to be a JSON string containing username, email, and password.
      // 3. If !res.ok, throw an Error with the backend's message.
      // 4. If successful, redirect the user to the login page using router.push()
      const res = await fetch("http://127.0.0.1:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password})
      })

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      router.push("/login")      
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="coolcoder99"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full bg-gray-900 text-white font-semibold p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}