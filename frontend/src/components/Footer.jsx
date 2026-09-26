import { Link } from 'react-router-dom';
import { Logo } from './Navbar';

// Slim footer, desktop only (phones use the bottom navigation instead).
const Footer = () => {
  return (
    <footer className="hidden md:block border-t border-gray-200 bg-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-start justify-between gap-8">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-2 text-sm text-gray-500">Book trusted local professionals for repairs, cleaning and more, in your city.</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <Link to="/services" className="text-gray-600 hover:text-gray-900">All services</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">About KnockNow</Link>
          <Link to="/instant-service" className="text-gray-600 hover:text-gray-900">Instant service</Link>
          <Link to="/complaint" className="text-gray-600 hover:text-gray-900">Help &amp; complaints</Link>
          <Link to="/Rankings" className="text-gray-600 hover:text-gray-900">Top-rated services</Link>
          <Link to="/provider/register" className="text-gray-600 hover:text-gray-900">Become a provider</Link>
        </nav>
      </div>
      <div className="border-t border-gray-100">
        <p className="max-w-6xl mx-auto px-6 py-4 text-xs text-gray-400">© {new Date().getFullYear()} KnockNow</p>
      </div>
    </footer>
  );
};

export default Footer;
