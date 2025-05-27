import { useEffect, useState } from 'react';
import { Search, Tag, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('http://localhost:3000/api/v1/categories');
        if (response.ok) {
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);
  
  useEffect(() => {
    setFilteredCategories(prev => {
      if (!searchTerm) {
        return categories;
      }
      return categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    );
  }, [searchTerm, categories]);
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-gray-600">Explore topics that interest you</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8 relative">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
            <div className="pl-4 pr-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              className="block w-full py-3 px-2 focus:outline-none text-gray-900 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div 
              key={category.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">{category.name.toUpperCase()}</h3>
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {category.posts.length} {category.posts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
                {/* <p className="text-gray-600 text-sm mb-4">{category.description}</p> */}
                <Link to={`/${category.name}/articles`} className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Browse articles
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found matching "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
}