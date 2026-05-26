import CreatePost from "./components/CreatePost";
import CommentSection  from "./components/CommentSection";
import FollowButton from "./components/FollowButton";

interface Post{
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  username: string; 
}

export default async function Home() {
  // Fetch the posts
  const postRes = await fetch('http://127.0.0.1:3000/api/posts', { cache: 'no-store' });
  let posts: Post[] = [];
  if (postRes.ok) {
    posts = await postRes.json();
  }

  return (
    <main className="pt-8 pb-12 px-6 max-w-2xl mx-auto">
      <CreatePost />

      {/* Feed List */}
      <div className="space-y-12">
        {posts?.map((post) => (
          <div key={post.id}>
            <article className="group">
              <div className="flex gap-4 mb-2 items-start">
                <div className="w-12 h-12 rounded-full bg-outline-variant shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface">person</span>
                </div>
                <div className="flex flex-col justify-center w-full">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-body-md text-body-md font-semibold text-primary">
                      {post.username || "Unknown User"}
                    </span>
                    <FollowButton targetUserId={post.userId} />
                  </div>
                  <span className="font-code-label text-code-label text-secondary uppercase">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="pl-0 md:pl-16">
                <p className="font-body-md text-body-md text-on-surface mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>
                <CommentSection postId={post.id} />
              </div>
            </article>

            {/* Divider between posts */}
            <div className="h-px bg-outline-variant my-8"></div>
          </div>
        ))}
      </div>
    </main>
  );
}