"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null; 

  if (currentUserId === targetUserId) return null;

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token"); // Grab token once
    setIsLoading(true);

    try {
      if (isFollowing) {
        // DELETE: Unfollow
        const response = await fetch('http://127.0.0.1:3000/api/follow', {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Wristband attached
          },
          body: JSON.stringify({ followingId: targetUserId })
        });

        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData.error || "Failed to unfollow user");
        }
        
      } else {
        // POST: Follow
        const response = await fetch('http://127.0.0.1:3000/api/follow', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // THE BUG WAS HERE: This was missing!
          },
          body: JSON.stringify({ followingId: targetUserId })
        });

        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData.error || "Failed to follow user");
        }
      }

      setIsFollowing(!isFollowing);
      router.refresh();

    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`px-4 py-1 text-sm font-medium rounded-full border transition-colors ${
        isFollowing
          ? "bg-white text-gray-900 border-gray-300 hover:bg-gray-50" 
          : "bg-gray-900 text-white border-transparent hover:bg-gray-800" 
      }`}
    >
      {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}