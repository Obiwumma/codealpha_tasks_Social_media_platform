"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FollowButton from "@/app/components/FollowButton";

// The blueprint for the user's details
interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// The blueprint for a single post
interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const targetUserId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New state variables to hold our backend data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // The fetch is now active!
        const res = await fetch(`http://127.0.0.1:3000/api/users/${targetUserId}`);
        
        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();
        setProfile(data.profile);
        setPosts(data.posts);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [targetUserId]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white min-h-screen border-x border-gray-200">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-200 flex items-start justify-between">
        <div>
          <div className="w-16 h-16 bg-linear-to-tr from-gray-200 to-gray-300 rounded-full mb-4"></div>
          {/* Optional chaining handles the split second before data loads */}
          <h1 className="text-2xl font-bold">{profile?.username || "Unknown User"}</h1>
          <p className="text-sm text-gray-500 mb-4">{profile?.email}</p>
          
          <div className="flex gap-4 text-sm">
            {/* Hardcoded for the MVP UI Shell until we build the dynamic follower counts */}
            <span className="text-gray-500"><strong className="text-gray-900">14</strong> Following</span>
            <span className="text-gray-500"><strong className="text-gray-900">128</strong> Followers</span>
          </div>
        </div>
        
        <div className="pt-2">
          <FollowButton targetUserId={targetUserId} />
        </div>
      </div>

      {/* User's Feed */}
      <div className="p-0">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-900">{profile?.username}</span>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}