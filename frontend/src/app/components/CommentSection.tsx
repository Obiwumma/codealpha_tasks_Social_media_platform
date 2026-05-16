"use client";

import { useState, useEffect } from "react"; // 1. Added useEffect
import { useRouter } from "next/navigation";

// 2. Define the Comment interface
interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]); // 3. State to hold comments
  const router = useRouter();

  const testUserId = "ea95eed8-de74-4f2c-90e4-5b58e4f6bd8a"; 

  // 4. Fetch the comments when this component loads!
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:3000/api/comments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to load comments", error);
      }
    };

    fetchComments();
  }, [postId]); // Re-run if the postId changes

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:3000/api/comments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: testUserId, postId })
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.error || "Failed to post comment");
      }

      setContent("");
      
      // Refresh the page so the Server Component Feed updates
      router.refresh(); 

      // Manually add the new comment to our local Client Component state 
      // so it shows up instantly without waiting for the server!
      setComments((prev) => [
        {
          id: Math.random().toString(), // temporary fake ID for instant UI update
          content,
          userId: testUserId,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

    } catch (error) {
      console.error("Failed to post comment:", error);
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      
      {/* The Display Comments Section */}
      {comments.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800">
              {comment.content}
            </div>
          ))}
        </div>
      )}

      {/* The Comment Input Form */}
      <form onSubmit={handleComment} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting || !content}
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "..." : "Reply"}
        </button>
      </form>
    </div>
  );
}