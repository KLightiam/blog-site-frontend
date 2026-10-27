import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/" className="font-serif text-xl font-semibold">
            Kabah’s Blog
          </Link>
          <p className="mt-1 max-w-sm text-sm text-muted">Stories on technology, travel, lifestyle and photography by Kabah Atawoge.</p>
        </div>
        <p className="text-sm text-muted">&copy; {new Date().getFullYear()} Kabah Atawoge</p>
      </div>
    </footer>
  );
}

export default Footer;
