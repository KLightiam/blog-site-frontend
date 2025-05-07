import { Link } from 'react-router-dom';


function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-black">Blog</Link>
            <p className="text-gray-600 mt-2">Sharing insights on web development and more.</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-6">
            <Link to="/" className="text-gray-600 hover:text-black mb-2 md:mb-0">Home</Link>
            <Link to="/categories" className="text-gray-600 hover:text-black mb-2 md:mb-0">Categories</Link>
            <Link to="/about" className="text-gray-600 hover:text-black mb-2 md:mb-0">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-black">Contact</Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer;

    