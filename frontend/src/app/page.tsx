import CreatePost from "./components/CreatePost";
import CommentSection  from "./components/CommentSection";
import FollowButton from "./components/FollowButton";

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

interface Post{
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export default async function Home() {
  
  // 1. Fetch the data from your running Express server
  const res = await fetch('http://127.0.0.1:3000/api/users', {cache: 'no-store'})
  
  // 2. Convert the response to JSON
  const users: User[] = await res.json();

  // Fetch the posts
  const postRes = await fetch('http://127.0.0.1:3000/api/posts', { cache: 'no-store' });
  const posts: Post[] = await postRes.json();

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Registered Users</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
        {users.map((user) => (
          // 3. Added some Tailwind styling to make them look like cards!
          <div key={user.id} className="border border-gray-200 p-4 rounded-xl shadow-sm bg-white">
            <p className="font-semibold text-lg text-gray-900">{user.username}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>

      <CreatePost />

      {/* The Feed Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Global Feed</h2>
        <div className="flex flex-col gap-4">
          
          {/* YOUR CHALLENGE: Map over the 'posts' array here! */}
          {/* For each post, create a <div> that displays the post.content */}
          {/* Give it a nice white background, some padding, and a border to match the CreatePost box */}
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-900 text-lg">{post.content}</p>
                
                {/* Inject the follow button, passing the ID of the post's author! */}
                <FollowButton targetUserId={post.userId} />
              </div>
              
              <CommentSection postId={post.id} />
            </div>
          ))}
          
        </div>
      </div>
    </main>
  );
}