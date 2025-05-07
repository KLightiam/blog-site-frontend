import BlogCard from '../components/BlogCard';
import { blogPosts } from '../data/blogPosts';

function Home() {
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
