import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import DashboardHeader from '../provider/Header';
import { AvailabilityProvider } from '../provider/AvailabilityContext';
import { PageSkeleton } from '../ui/Skeleton';
import { getAuthUser } from '../../lib/auth';

/** Shell for signed-in provider pages. Sends signed-out visitors to provider login. */
export default function ProviderLayout() {
  const location = useLocation();
  const user = getAuthUser();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (user?.role !== 'provider') {
    return <Navigate to="/provider/login" replace state={{ from: location.pathname }} />;
  }

  return (
    <AvailabilityProvider>
      <div className="min-h-screen bg-white">
        <DashboardHeader />
        <main className="pt-14 lg:pl-60 pb-bottom-nav lg:pb-8">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </AvailabilityProvider>
  );
}

/** Consistent page wrapper + title for provider pages. */
export function ProviderPage({ title, subtitle, actions, children, width = 'max-w-5xl' }) {
  return (
    <div className={`${width} mx-auto px-4 sm:px-6 py-5 sm:py-6`}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            {title && <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
