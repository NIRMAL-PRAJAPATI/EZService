import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Navigation, CalendarDays, Zap, Wrench, MessageSquareWarning, UserRound, LogOut } from 'lucide-react';
import resources from '../../resource';
import InstantStatusToggle from './InstantStatusToggle';
import { logout } from '../../lib/auth';

export const PROVIDER_NAV = [
  { to: '/provider/trips', label: 'Running trip', short: 'Trip', icon: Navigation },
  { to: '/provider/dashboard', label: 'Dashboard', short: 'Home', icon: LayoutDashboard },
  { to: '/provider/calendar', label: 'Calendar', short: 'Calendar', icon: CalendarDays, desktopOnly: true },
  { to: '/provider/instant-requests', label: 'Instant requests', short: 'Requests', icon: Zap },
  { to: '/provider/services', label: 'My services', short: 'Services', icon: Wrench },
  { to: '/provider/complaints', label: 'Complaints', short: 'Complaints', icon: MessageSquareWarning, desktopOnly: true },
  { to: '/provider/profile', label: 'Account', short: 'Account', icon: UserRound },
];

/**
 * Provider shell navigation (business interface, distinct from the customer app):
 * top bar with availability pill, a left sidebar on desktop, bottom tabs on phones.
 */
const DashboardHeader = () => {
  return (
    <>
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-40 h-14 bg-white border-b border-gray-200 text-gray-900">
        <div className="h-full px-4 lg:pl-6 flex items-center gap-3">
          <Link to="/provider/trips" className="flex items-center gap-2">
            <img src={resources.Logo.src} className="h-6 w-6" alt="" />
            <span className="font-bold">KnockNow</span>
            <span className="ml-1 rounded-sm bg-indigo-50 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-600">Partner</span>
          </Link>
          <div className="ml-auto">
            <InstantStatusToggle compact />
          </div>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 z-30 w-60 flex-col border-r border-gray-200 bg-white">
        <nav aria-label="Provider" className="flex-1 p-3 space-y-1">
          {PROVIDER_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 h-11 px-3 rounded-sm text-sm font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button type="button" onClick={() => logout('/provider/login')} className="flex w-full items-center gap-3 h-11 px-3 rounded-sm text-sm font-medium text-gray-600 hover:bg-gray-50">
            <LogOut className="h-5 w-5" aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile bottom tabs */}
      <nav aria-label="Provider" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 bottom-safe">
        <ul className="grid grid-cols-5">
          {PROVIDER_NAV.filter((i) => !i.desktopOnly).map(({ to, short, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}
              >
                {({ isActive }) => (
                  <>
                    <span aria-hidden="true" className={`absolute top-0 inset-x-4 h-0.5 rounded-sm ${isActive ? 'bg-indigo-500' : 'bg-transparent'}`} />
                    <Icon className="h-6 w-6" strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" />
                    {short}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default DashboardHeader;
