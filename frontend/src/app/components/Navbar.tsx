"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Check the vault every time the route changes
  useEffect(() => {
    setCurrentUserId(localStorage.getItem("userId"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUserId(null);
    router.push("/login");
  };

  // Don't show the navbar on the auth screens
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-gray-900">
          Zen
        </Link>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          {currentUserId ? (
            <>
              <Link href={`/profile/${currentUserId}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}