"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    // 1. Stop the page from refreshing when we submit the form!
    e.preventDefault(); 
    setIsLoading(true);
    setError(""); // Clear any old errors

    try {
      // 2. Hit your new, secure backend route
      const res = await fetch("http://127.0.0.1:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // 3. Catch invalid credentials
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      // 4. THE MAGIC VAULT: Save the VIP wristband to the browser!
      localStorage.setItem("token", data.token);

      // 5. Success! Send the user to the home page feed
      router.push("/");
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}