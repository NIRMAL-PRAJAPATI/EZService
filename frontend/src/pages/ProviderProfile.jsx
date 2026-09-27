import { Link } from "react-router-dom";
import { ChevronRight, MessageSquareWarning, Star, Wrench, LogOut, CalendarDays } from "lucide-react";
import Profileinfo from "../components/Profile/provider/ProfileInfo";
import ProfileBank from "../components/Profile/provider/ProfileBank";
import LogoutDelete from "../components/Profile/provider/ProfileLogDel";
import ProfilePassword from '../components/Profile/provider/ProfilePassword';
import InstantStatusToggle from "../components/provider/InstantStatusToggle";
import { ProviderPage } from "../components/layout/ProviderLayout";
import { logout } from "../lib/auth";
import ThemeSwitcher from "../components/ThemeSwitcher";

const LINKS = [
  { to: '/provider/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/provider/services', label: 'Services & prices', icon: Wrench },
  { to: '/provider/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/provider/reviews', label: 'Reviews', icon: Star },
];

export default function ProfilePage() {
  return (
    <ProviderPage title="Account" subtitle="Your business details, availability and payouts.">
      <div className="space-y-6">
        <InstantStatusToggle />

        <nav aria-label="Business" className="rounded-md border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-3 px-4 h-14 hover:bg-gray-50">
              <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              <span className="flex-1 font-medium text-gray-800">{label}</span>
              <ChevronRight className="h-5 w-5 text-gray-300" aria-hidden="true" />
            </Link>
          ))}
          <button type="button" onClick={() => logout('/provider/login')} className="flex w-full items-center gap-3 px-4 h-14 text-left hover:bg-gray-50 lg:hidden">
            <LogOut className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="flex-1 font-medium text-gray-800">Log out</span>
          </button>
        </nav>

        <section aria-labelledby="appearance-title" className="rounded-md border border-gray-200 bg-white p-5">
          <h2 id="appearance-title" className="text-base font-bold tracking-wide text-gray-900">Appearance</h2>
          <p className="text-sm text-gray-500 mb-4">Choose a light or dark look. System follows your device setting.</p>
          <ThemeSwitcher />
        </section>

        <section aria-label="Business information">
          <Profileinfo />
        </section>
        <section aria-label="Bank account">
          <ProfileBank />
        </section>
        <section aria-label="Password">
          <ProfilePassword />
        </section>
        <section aria-label="Log out or delete account">
          <LogoutDelete />
        </section>
      </div>
    </ProviderPage>
  );
}
