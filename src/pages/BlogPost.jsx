
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(post => post.id === parseInt(id));
  
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
    <article className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-500">
          <span>{post.date}</span>
        </p>
      </div>
      
      <div className="mb-8">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
      
      <div className="prose prose-lg max-w-none">
        <p>
          {post.fullContent || "This is a placeholder for the full blog post content. In a real application, this would contain the complete article with formatted text, images, and other media."}
        </p>
        
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl nunc euismod nisi, eu porttitor nisl nisi euismod nisi.</p>
        
        <h2>Section Heading</h2>
        <p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
        
        <blockquote className="border-l-4 border-gray-300 pl-4 italic">
          This is an example blockquote that could be used to highlight important information or quotes within the blog post.
        </blockquote>
        
        <p>Donec sed odio dui. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Donec ullamcorper nulla non metus auctor fringilla.</p>
      </div>
      
      <div className="mt-12">
        <Link 
          to="/" 
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to All Posts
        </Link>
      </div>
    </article>
  );
}

export default BlogPost;