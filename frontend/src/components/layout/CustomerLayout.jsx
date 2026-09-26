import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import MobileBottomNav from './MobileBottomNav';
import { PageSkeleton } from '../ui/Skeleton';

// Focused pages: on phones they show their own back-arrow header and no bottom
// nav (they usually have a sticky primary action at the bottom instead).
const DETAIL_ROUTES = ['/service/:id', '/orders/:id/view', '/book', '/instant-service', '/complaint'];

export default function CustomerLayout() {
  const { pathname } = useLocation();
  const isDetail = DETAIL_ROUTES.some((pattern) => matchPath(pattern, pathname));

  // Open every new page at the top instead of keeping the previous page's scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-sm focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      {/* The wrapper is the sticky element so the header stays pinned while scrolling */}
      <div className={`${isDetail ? 'hidden md:block' : ''} md:sticky md:top-0 z-40`}>
        <Navbar showMobile={!isDetail} />
      </div>
      <main id="main" className={`flex-1 ${isDetail ? '' : 'pb-bottom-nav md:pb-0'}`}>
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Focused flows have their own bottom action bar, so no footer there */}
      {!isDetail && <Footer />}
      {!isDetail && <MobileBottomNav />}
    </div>
  );
}
