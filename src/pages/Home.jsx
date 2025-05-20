import BlogCard from '../components/BlogCard';
import { blogPosts as blogs} from '../data/blogPosts';
import { useEffect, useState } from 'react';

function Home() {
  const [blogPosts, setBlogPosts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('http://localhost:3000/api/v1/trendingposts');
        if (!response.ok) {
          console.error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched blog posts:', data);
        setBlogPosts(data);
      }
      catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    }
    fetchBlogPosts();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-12">Top 5 Trending Stories</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
