
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigate();

  useEffect(() => {
    async function fetchPost() {

      try {
        const response = await fetch(`http://localhost:3000/api/v1/posts/${id}`);
        if (!response.ok) {
          console.error('Network response was not ok');
          return;
        }
        const data = await response.json();
        setPost(data);
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, []);
  
  if (!post) {
    return (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Blog post not found</h2>
        <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link to="/" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">Back to Home</Link>
      </div>
    );
  }
  
  return (
  <>
    {loading ? (
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Loading...</h2>
        <p className="text-gray-600 mb-8">Please wait while we fetch the blog post.</p>
      </div>
    ) : (
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500">
          <span>{new Date(post.date).toLocaleDateString()}</span>
        </p>
      </div>
      
      <div className="mb-8">
        <img 
          src={post.files[0].url} 
          alt={post.title} 
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
      
      <div className="prose prose-lg max-w-none">
        <p>
          {post.content || "No content available for this post."}
        </p>       
      </div>
      
      <div className="mt-12">
        {/* <Link 
          to="/" 
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to All Posts
        </Link> */}
        <button 
          onClick={() => navigation(-1)} 
          className="inline-block dark:bg-black bg-indigo-700 text-white px-6 py-3 rounded-lg dark:hover:bg-gray-800 hover:bg-indigo-800 transition-colors">Go Back</button>
      </div>
    </article>
  )}
  </>
  );
}

export default BlogPost;