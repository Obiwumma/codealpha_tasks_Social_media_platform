"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({ targetUserId }: { targetUserId: string }) {
  // In a real app, we'd check the database to see if we ALREADY follow them when the page loads.
  // For now, we will just default it to false so we can test the button.
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const testUserId = "ea95eed8-de74-4f2c-90e4-5b58e4f6bd8a"; // This is YOU

  // 1. Safety Check: Don't show a follow button if the post belongs to us!
  if (testUserId === targetUserId) return null;

  const handleFollowToggle = async () => {
    setIsLoading(true);

    try {
      // YOUR TURN: Write the logic to Follow or Unfollow!
      
      if (isFollowing) {
        // 2a. The user wants to UNFOLLOW. Write a fetch() using the "DELETE" method.
        // It goes to http://127.0.0.1:3000/api/follow
        // The body needs to send followerId (you) and followingId (the target)
        const response = await fetch('http://127.0.0.1:3000/api/follow', {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({followerId: testUserId, followingId: targetUserId})
        })

        if (!response.ok) {
        // We try to parse the error message from the backend
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to create post");
      }
        
      } else {
        // 2b. The user wants to FOLLOW. Write a fetch() using the "POST" method.
        // It goes to the exact same URL, with the exact same body!
        const response = await fetch('http://127.0.0.1:3000/api/follow', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({followerId: testUserId, followingId: targetUserId})
        })

        if (!response.ok) {
        // We try to parse the error message from the backend
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to create post");
      }

      }

      // 3. If successful, flip the button state!
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
          ? "bg-white text-gray-900 border-gray-300 hover:bg-gray-50" // Unfollow style
          : "bg-gray-900 text-white border-transparent hover:bg-gray-800" // Follow style
      }`}
    >
      {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}