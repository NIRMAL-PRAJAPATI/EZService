import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ClipboardList, IndianRupee, Clock, ChevronRight, Wrench, MessageSquareWarning, Zap, Inbox } from 'lucide-react';
import authApi from '../config/auth-config';
import InstantStatusToggle from '../components/provider/InstantStatusToggle';
import ProviderOrderCard from '../components/provider/ProviderOrderCard';
import { ProviderPage } from '../components/layout/ProviderLayout';
import { Skeleton, CardListSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { normalizeStatus } from '../components/ui/StatusBadge';
import { formatPrice } from '../lib/format';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [openComplaints, setOpenComplaints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      authApi.get('/provider/stats'),
      authApi.get('/provider/profile').catch(() => ({ data: null })),
      authApi.get('/orders/provider').catch(() => ({ data: [] })),
      authApi.get('/complaints/provider').catch(() => ({ data: [] })),
    ])
      .then(([s, p, o, c]) => {
        setStats(s.data);
        setProfile(p.data);
        setOrders(Array.isArray(o.data) ? o.data : []);
        setOpenComplaints((Array.isArray(c.data) ? c.data : []).filter((x) => x.status === 'OPEN' || x.status === 'IN_PROGRESS').length);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const newOrders = orders.filter((o) => normalizeStatus(o.status) === 'PENDING');
  const upcoming = orders.filter((o) => normalizeStatus(o.status) === 'CONFIRMED');
  const firstName = profile?.name?.split(' ')[0];

  const onUpdated = (orderId, status) => setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, status } : o)));

  if (error) {
    return (
      <ProviderPage>
        <ErrorState description="We couldn't load your dashboard." onRetry={load} />
      </ProviderPage>
    );
  }

  const completionRate = stats && stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;

  return (
    <ProviderPage>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="text-sm text-gray-500">Here's your business today.</p>
      </div>

      <InstantStatusToggle />

      {/* Overview */}
      <section className="mt-6" aria-labelledby="overview-title">
        <h2 id="overview-title" className="text-lg font-bold tracking-wide text-gray-900 mb-3">
          Overview
        </h2>
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat icon={ClipboardList} label="Total orders" value={stats.totalOrders} />
            <Stat icon={IndianRupee} label="Earnings this month" value={formatPrice(stats.totalEarnings)} />
            <Stat icon={Star} label={`Rating · ${stats.totalReviews} review${stats.totalReviews === 1 ? '' : 's'}`} value={Number(stats.averageRating) > 0 ? `${stats.averageRating} ★` : 'New'} />
            <Stat icon={Clock} label="Waiting for you" value={stats.pendingOrders} highlight={stats.pendingOrders > 0} />
          </div>
        )}
      </section>

      {/* New orders */}
      <section className="mt-8" aria-labelledby="new-orders-title">
        <div className="flex items-center justify-between mb-3">
          <h2 id="new-orders-title" className="text-lg font-bold tracking-wide text-gray-900">
            New orders {newOrders.length > 0 && <span className="ml-1 rounded-sm bg-amber-100 px-2 py-0.5 text-sm text-amber-800">{newOrders.length}</span>}
          </h2>
          <Link to="/provider/orders" className="inline-flex items-center text-sm font-semibold text-indigo-600">
            All orders <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <CardListSkeleton count={2} />
        ) : newOrders.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center">
            <Inbox className="mx-auto h-8 w-8 text-gray-300" aria-hidden="true" />
            <p className="mt-2 font-medium text-gray-900">No new orders</p>
            <p className="text-sm text-gray-500">New bookings will show up here for you to accept.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {newOrders.slice(0, 4).map((o) => (
              <ProviderOrderCard key={o.order_id} order={o} onUpdated={onUpdated} />
            ))}
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Shortcuts">
        <QuickLink to="/provider/orders" icon={ClipboardList} title="Upcoming jobs" value={loading ? '…' : `${upcoming.length} confirmed`} />
        <QuickLink to="/provider/instant-requests" icon={Zap} title="Instant requests" value="Live requests near you" />
        <QuickLink to="/provider/complaints" icon={MessageSquareWarning} title="Complaints" value={loading ? '…' : openComplaints ? `${openComplaints} need attention` : 'All clear'} alert={openComplaints > 0} />
      </section>

      {/* Performance */}
      {!loading && stats && (
        <section className="mt-8" aria-labelledby="perf-title">
          <h2 id="perf-title" className="text-lg font-bold tracking-wide text-gray-900 mb-3">
            Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Meter label="Completion rate" value={completionRate} text={`${stats.completedOrders} completed of ${stats.totalOrders} orders`} />
            <Meter
              label="Orders this month"
              value={stats.lastMonthOrders > 0 ? Math.min(100, Math.round((stats.currentMonthOrders / stats.lastMonthOrders) * 100)) : stats.currentMonthOrders > 0 ? 100 : 0}
              text={`${stats.currentMonthOrders} this month · ${stats.lastMonthOrders} last month`}
              suffix="of last month"
            />
          </div>

          {stats.latestReview?.customerName && (
            <div className="mt-3 rounded-md border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Latest review</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="font-semibold text-gray-900">{stats.latestReview.customerName}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" /> {stats.latestReview.rating}
                </span>
              </div>
              {stats.latestReview.comment && <p className="text-sm text-gray-700 mt-1">{stats.latestReview.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {stats.latestReview.serviceName} · {stats.latestReview.created}
              </p>
            </div>
          )}
        </section>
      )}

      <Link to="/provider/services" className="mt-8 flex items-center gap-3 rounded-md border border-gray-200 bg-white p-4 hover:border-indigo-300">
        <span className="h-10 w-10 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Wrench className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-gray-900">My services</span>
          <span className="block text-sm text-gray-500">{loading ? '…' : `${stats?.totalServices || 0} listed. Add or update prices and photos.`}</span>
        </span>
        <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </Link>
    </ProviderPage>
  );
}

function Stat({ icon: Icon, label, value, highlight }) {
  return (
    <div className={`rounded-md border p-4 ${highlight ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <Icon className={`h-5 w-5 ${highlight ? 'text-amber-600' : 'text-indigo-500'}`} aria-hidden="true" />
      <p className="mt-2 text-2xl font-extrabold tracking-wide text-gray-900 tabular-nums">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, value, alert }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-4 hover:border-indigo-300">
      <Icon className={`h-5 w-5 ${alert ? 'text-red-500' : 'text-gray-400'}`} aria-hidden="true" />
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-gray-900">{title}</span>
        <span className={`block text-sm truncate ${alert ? 'text-red-600' : 'text-gray-500'}`}>{value}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-gray-300" aria-hidden="true" />
    </Link>
  );
}

function Meter({ label, value, text, suffix = '' }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-lg font-bold text-gray-900 tabular-nums">
          {value}% <span className="text-xs font-normal text-gray-400">{suffix}</span>
        </p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-2 text-xs text-gray-500">{text}</p>
    </div>
  );
}

export default Dashboard;
