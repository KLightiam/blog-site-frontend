import { Mail, Instagram, Twitter, Github } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">About Me</h1>
          <p className="mt-2 text-gray-600">Learn more about who I am and what I do</p>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Section */}
          <div className="md:flex">
            <div className="md:w-1/3 bg-indigo-700 p-8 text-center">
              <div className="mb-4">
                <img 
                  src="/api/placeholder/200/200" 
                  alt="Profile"
                  className="rounded-full mx-auto border-4 border-white shadow-lg w-32 h-32 object-cover" 
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Kabah Atawoge</h2>
              <p className="text-indigo-200 mb-6">Blogger & Journalist</p>
              
              <div className="flex justify-center space-x-4">
                <a href="#" className="text-white hover:text-indigo-200">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-indigo-200">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-indigo-200">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-white hover:text-indigo-200">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Hey there, I'm Kabah!</h3>
                
                <p className="text-gray-600 mb-4">
                  Welcome to my blog! I'm a passionate writer and digital storyteller with over 5 years of experience creating content across various niches. My journey began in 2020 when I decided to share my thoughts on technology, travel, and lifestyle with the world.
                </p>
                
                <p className="text-gray-600 mb-6">
                  What started as a simple hobby has evolved into a platform where I connect with readers from around the globe. My mission is to create valuable, insightful, and entertaining content that inspires and helps others.
                </p>
                
                <h4 className="text-xl font-medium text-gray-900 mb-3">What I Write About</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-indigo-700 mb-1">Technology</h5>
                    <p className="text-sm text-gray-600">Latest trends, gadget reviews, and digital solutions</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-indigo-700 mb-1">Travel</h5>
                    <p className="text-sm text-gray-600">Destinations, adventure stories, and travel tips</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-indigo-700 mb-1">Lifestyle</h5>
                    <p className="text-sm text-gray-600">Wellness, productivity, and personal growth</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-indigo-700 mb-1">Photography</h5>
                    <p className="text-sm text-gray-600">Tips, techniques, and visual storytelling</p>
                  </div>
                </div>
                
                <h4 className="text-xl font-medium text-gray-900 mb-3">My Story</h4>
                <p className="text-gray-600 mb-4">
                  Before becoming a full-time blogger, I worked in marketing for several tech companies. My background in digital marketing has helped me understand how to create content that resonates with readers and builds a loyal community.
                </p>
                <p className="text-gray-600">
                  When I'm not writing, you can find me hiking local trails, experimenting with new recipes in the kitchen, or curled up with a good book. I believe in continuous learning and am always exploring new topics to share with my audience.
                </p>
              </div>
            </div>
          </div>
          
          {/* Newsletter Section */}
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Join My Newsletter</h3>
              <p className="text-gray-600 mb-4 max-w-lg mx-auto">Stay updated with my latest posts and receive exclusive content straight to your inbox.</p>
              
              <div className="flex max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-r-lg transition duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}