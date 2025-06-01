import { useState } from 'react';
import { Link } from 'react-router-dom';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }
  const closeMenu = () => {
    setIsMenuOpen(false);
  }

    return (
        <header className="shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-black">Blog</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none" 
            onClick={() => toggleMenu()}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><Link to="/" className="text-black hover:text-gray-600 font-medium">Home</Link></li>
              <li><Link to="/categories" className="text-black hover:text-gray-600 font-medium">Categories</Link></li>
              <li><Link to="/about" className="text-black hover:text-gray-600 font-medium">About</Link></li>
              <li><Link to="/contact" className="text-black hover:text-gray-600 font-medium">Contact</Link></li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4">
            <ul className="flex flex-col space-y-4">
              <li><Link to="/" className="text-black hover:text-gray-600 font-medium" onClick={() => closeMenu()}>Home</Link></li>
              <li><Link to="/categories" className="text-black hover:text-gray-600 font-medium" onClick={() => closeMenu()}>Categories</Link></li>
              <li><Link to="/about" className="text-black hover:text-gray-600 font-medium" onClick={() => closeMenu()}>About</Link></li>
              <li><Link to="/contact" className="text-black hover:text-gray-600 font-medium" onClick={() => closeMenu()}>Contact</Link></li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
export default Header;