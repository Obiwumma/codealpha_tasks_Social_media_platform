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
  
  // State variables to hold our backend data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
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

  if (isLoading) return <div className="p-8 text-center text-secondary font-body-sm">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-error font-body-sm">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto min-h-screen bg-background border-x border-outline-variant pb-12">
      {/* Profile Header Section */}
      <header className="relative">
        {/* Cover Image Placeholder */}
        <div className="h-48 w-full bg-surface-container-highest overflow-hidden">
          <div className="w-full h-full bg-linear-to-br from-surface-variant to-outline-variant opacity-50"></div>
        </div>
        
        <div className="px-6 -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-background bg-surface-container overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-surface-variant">person</span>
            </div>
          </div>
          
          <div className="flex gap-3 pb-2">
            <button className="p-2.5 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </button>
            <button className="p-2.5 rounded-full border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            {/* Injecting your dynamic Follow Button exactly where the designer placed it */}
            <FollowButton targetUserId={targetUserId} />
          </div>
        </div>
        
        <div className="px-6 mt-6">
          <h1 className="font-headline-lg text-headline-lg text-primary">{profile?.username || "Unknown User"}</h1>
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">
            @{profile?.username?.toLowerCase() || "user"}
          </p>
          <p className="mt-4 max-w-lg text-body-lg text-on-surface">
            {profile?.email}
          </p>
          
          <div className="flex gap-6 mt-6 pb-6 border-b border-outline-variant">
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="font-bold text-primary">14</span>
              <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">Following</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <span className="font-bold text-primary">128</span>
              <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">Followers</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex w-full border-b border-outline-variant sticky top-14 bg-background/80 backdrop-blur-xl z-40">
        <button className="flex-1 py-4 font-label-caps text-label-caps uppercase font-bold text-primary border-b-2 border-primary">Posts</button>
        <button className="flex-1 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low transition-colors">Media</button>
        <button className="flex-1 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low transition-colors">Links</button>
        <button className="flex-1 py-4 font-label-caps text-label-caps uppercase text-on-surface-variant hover:bg-surface-container-low transition-colors">Liked</button>
      </div>

      {/* Posts Feed */}
      <section className="divide-y divide-outline-variant">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-secondary text-body-sm font-body-sm">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="p-6 hover:bg-surface-container-lowest transition-colors duration-200 group">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface-variant">person</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{profile?.username}</span>
                      <span className="text-on-surface-variant font-label-caps text-label-caps">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">more_horiz</span>
                  </div>
                  
                  <p className="text-body-lg font-body-lg text-on-surface mb-4 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  <div className="flex justify-between max-w-md text-on-surface-variant mt-4">
                    <button className="flex items-center gap-2 hover:text-secondary transition-colors group/btn">
                      <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                      <span className="font-label-caps text-label-caps">0</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-on-tertiary-container transition-colors group/btn">
                      <span className="material-symbols-outlined text-[20px]">sync</span>
                      <span className="font-label-caps text-label-caps">0</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-error transition-colors group/btn">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                      <span className="font-label-caps text-label-caps">0</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition-colors group/btn">
                      <span className="material-symbols-outlined text-[20px]">share</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}