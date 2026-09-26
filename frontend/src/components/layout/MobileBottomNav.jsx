import { NavLink } from 'react-router-dom';
import { Home, Wrench, ClipboardList, UserRound } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/services', label: 'Services', icon: Wrench },
  { to: '/order', label: 'Bookings', icon: ClipboardList },
  { to: '/profile', label: 'Account', icon: UserRound },
];

export default function MobileBottomNav() {
  return (
    <nav aria-label="Main" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 bottom-safe">
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Groww-style active marker on top of the tab */}
                  <span aria-hidden="true" className={`absolute top-0 inset-x-6 h-0.5 rounded-sm ${isActive ? 'bg-indigo-500' : 'bg-transparent'}`} />
                  <Icon className="h-6 w-6" strokeWidth={isActive ? 2.4 : 1.8} aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
