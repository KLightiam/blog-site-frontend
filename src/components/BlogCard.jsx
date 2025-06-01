import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function BlogCard({ post,category }) {
  return (
    <article className=" rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
    <Link to={`/blog/${post.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={post.files[0].url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        
        <div className="p-6">
          <p className="dark:text-gray-100 text-sm mb-2">{new Date(post.date).toLocaleDateString()}</p>
          <h3 className="text-xl font-bold mb-3 leading-tight">{post.title}</h3>
          <p className="dark:text-gray-300">{post.content.split(" ").slice(0,10).join(' ')+"..."}</p>
        </div>
      </Link>
    </article>
  );
}
export default BlogCard;