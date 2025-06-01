import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";

export default function CategoryPosts(){
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    // const [categoryName, setCategoryName] = useState("");
    // const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            // setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/v1/${categoryName}/posts`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched posts:", data);
                    setPosts(data);
                }

            } catch (error) {
                setPosts([]);
                console.error("Error fetching posts:", error);
            }
            // setLoading(false);
        };
        fetchPosts();
    }, [ categoryName ]);

    // if (loading) return <div>Loading...</div>;

    return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-12">All Stories Under <br /><span className="text-indigo-500">{categoryName.toUpperCase()} </span></h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <button
        onClick={() => navigate("/categories")}
        className="mt-8 text-white hover:bg-indigo-700 bg-indigo-600 dark:bg-black transition dark:text-white px-6 py-3 rounded-lg dark:hover:bg-gray-800 duration-300 ease-in-out"
      >
        Back to Categories
      </button>
    </div>
            // <p>{article.description.split(" ").slice(0,10).join(" ")}...</p>
    );
};

