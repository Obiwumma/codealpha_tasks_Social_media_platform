"use client";

import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  username?: string; 
}

export default function CommentSection({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]); 
  const router = useRouter();
  
  // Dynamically grab ID instead of hardcoding for testing!
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

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
  }, [postId]); 

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !currentUserId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:3000/api/comments', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: currentUserId, postId })
      });

      if (!response.ok) throw new Error("Failed to post comment");

      setContent("");
      router.refresh(); 

      setComments((prev) => [
        {
          id: Math.random().toString(), 
          content,
          userId: currentUserId,
          createdAt: new Date().toISOString(),
          username: "You" // Instantly show "You" for the person who just typed it
        },
        ...prev,
      ]);

    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-outline-variant pt-4">
      {comments.length > 0 && (
        <div className="mb-4 flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-surface-container p-3 rounded-lg text-body-sm font-body-sm text-on-surface">
              <span className="font-bold text-primary text-[11px] uppercase tracking-wider block mb-1">
                {comment.username || "Unknown"}
              </span>
              {comment.content}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleComment} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-surface border border-outline-variant rounded-full px-4 py-2 text-body-sm font-body-sm focus:outline-none focus:border-primary text-on-surface placeholder:text-secondary"
        />
        <button
          type="submit"
          disabled={isSubmitting || !content}
          className="bg-primary text-on-primary px-4 py-2 rounded-full font-code-label text-code-label uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "..." : "Reply"}
        </button>
      </form>
    </div>
  );
}