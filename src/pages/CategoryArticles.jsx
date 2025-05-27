import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CategoryArticles = () => {
    const { categoryId } = useParams();
    const [articles, setArticles] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                // Replace with your actual API endpoints
                const [articlesRes, categoryRes] = await Promise.all([
                    fetch(`/api/categories/${categoryId}/articles`),
                    fetch(`/api/categories/${categoryId}`),
                ]);
                const articlesData = await articlesRes.json();
                const categoryData = await categoryRes.json();
                setArticles(articlesData);
                setCategoryName(categoryData.name || "Category");
            } catch (error) {
                setArticles([]);
                setCategoryName("Category");
            }
            setLoading(false);
        };
        fetchArticles();
    }, [categoryId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Articles in "{categoryName}"</h2>
            {articles.length === 0 ? (
                <p>No articles found for this category.</p>
            ) : (
                <ul>
                    {articles.map((article) => (
                        <li key={article.id}>
                            <a href={`/articles/${article.id}`}>{article.title}</a>
                            <p>{article.description.split(" ").slice(0,10).join(" ")}...</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryArticles;