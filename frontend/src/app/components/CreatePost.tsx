"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { json } from "stream/consumers";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter()
  const testUserId = "ea95eed8-de74-4f2c-90e4-5b58e4f6bd8a"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing
    if (!content) return;

    setIsSubmitting(true);

    try {
      // YOUR TURN: Write the fetch() request to send this data to your backend!
      // Remember: 
      const response = await fetch('http://127.0.0.1:3000/api/posts', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: content, userId: testUserId })
      })
      // 1. It needs to go to http://127.0.0.1:3000/api/posts
      // 2. The method needs to be "POST"
      // 3. You need to send headers: { "Content-Type": "application/json" }
      // 4. The body needs to be a JSON string containing 'content' and 'userId'

      if (!response.ok) {
        // We try to parse the error message from the backend
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to create post");
      }

      setContent("")
      router.refresh()    

    } catch (error) {
      console.error("Failed to post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={isSubmitting || !content}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}