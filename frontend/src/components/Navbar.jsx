import { Link, NavLink } from 'react-router-dom';
import { UserRound, Zap } from 'lucide-react';
import resources from '../resource';
import LocationSelector from './LocationSelector';
import { getAuthUser } from '../lib/auth';

export const Logo = ({ className = '' }) => (
  <Link to="/" className={`flex items-center gap-2 shrink-0 ${className}`} aria-label="EZService home">
    <img src={resources.Logo.src} className="h-7 w-7" alt="" />
    <span className="text-lg font-bold tracking-tight text-gray-900">EZService</span>
  </Link>
);

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/order', label: 'Bookings' },
  { to: '/explore', label: 'Explore' },
];

/**
 * Customer header.
 *  - Desktop: logo · main links · location · instant service · account
 *  - Mobile (main tabs only): logo + account on top, location underneath
 */
const Navbar = ({ showMobile = true }) => {
  const user = getAuthUser();
  const loggedIn = user?.role === 'customer';

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Desktop */}
      <div className="hidden md:flex max-w-6xl mx-auto h-16 px-6 items-center gap-8">
        <Logo />
        <nav aria-label="Main" className="flex items-center gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-sm text-sm font-medium transition-colors ${isActive ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <LocationSelector className="text-sm" />
          <Link
            to="/instant-service"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-sm border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
          >
            <Zap className="h-4 w-4" aria-hidden="true" /> Instant Service
          </Link>
          {loggedIn ? (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `h-10 w-10 rounded-full flex items-center justify-center border ${isActive ? 'border-indigo-500 text-indigo-600' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`
              }
              aria-label="My profile"
            >
              <UserRound className="h-5 w-5" />
            </NavLink>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="h-10 px-3 inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900">
                Log in
              </Link>
              <Link to="/register" className="h-10 px-4 inline-flex items-center rounded-sm bg-indigo-500 text-sm font-semibold text-white hover:bg-indigo-600">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      {showMobile && (
        <div className="md:hidden px-4 pt-2 pb-1.5">
          <div className="flex items-center justify-between h-10">
            <Logo />
            {loggedIn ? (
              <Link to="/profile" className="h-10 w-10 -mr-1 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100" aria-label="My profile">
                <UserRound className="h-6 w-6" />
              </Link>
            ) : (
              <Link to="/login" className="h-10 px-3 -mr-2 inline-flex items-center text-sm font-semibold text-indigo-600">
                Log in
              </Link>
            )}
          </div>
          <LocationSelector className="text-sm -ml-0.5" />
        </div>
      )}
    </header>
  );
};

export default Navbar;
