import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV = [
  { to: '/', label: 'Stories', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const linkClass = ({ isActive }) =>
  `rounded-full px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
    isActive ? 'bg-surface text-ink' : 'text-muted hover:text-ink'
  }`;

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight" onClick={closeMenu}>
          Kabah’s Blog
        </Link>

        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-ink hover:bg-surface md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-menu" className="border-t border-line md:hidden" aria-label="Main">
          <ul className="shell flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
