import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ClipboardList, IndianRupee, Clock, ChevronRight, Wrench, MessageSquareWarning, Zap, Inbox, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import authApi from '../config/auth-config';
import InstantStatusToggle from '../components/provider/InstantStatusToggle';
import ProviderOrderCard from '../components/provider/ProviderOrderCard';
import { ProviderPage } from '../components/layout/ProviderLayout';
import { Skeleton, CardListSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { normalizeStatus } from '../components/ui/StatusBadge';
import { formatPrice } from '../lib/format';
import { inRange, monthRange, dayRange, summarize } from '../lib/orderStats';
import { buttonClasses } from '../components/ui/Button';

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
  // Overview period: a month (default: this month) or a custom date range
  const [mode, setMode] = useState('month');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-01'));
  const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      authApi.get('/provider/stats'),
      authApi.get('/provider/profile').catch(() => ({ data: null })),
      authApi.get('/orders/provider?all=true').catch(() => ({ data: [] })),
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

  const range = useMemo(() => (mode === 'month' ? monthRange(month) : dayRange(from, to <= from ? from : to)), [mode, month, from, to]);
  const period = useMemo(() => summarize(inRange(orders, range)), [orders, range]);
  const periodLabel = mode === 'month' ? format(range.from, 'MMMM yyyy') : `${format(range.from, 'd MMM')} – ${format(range.to, 'd MMM yyyy')}`;

  const newOrders = orders.filter((o) => normalizeStatus(o.status) === 'PENDING');
  const upcoming = orders.filter((o) => normalizeStatus(o.status) === 'CONFIRMED');
  const firstName = profile?.name?.split(' ')[0];

  const onUpdated = (orderId, patch) => setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, ...patch } : o)));

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

      {/* Overview for a chosen period */}
      <section className="mt-6" aria-labelledby="overview-title">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <div>
            <h2 id="overview-title" className="text-lg font-bold tracking-wide text-gray-900">
              Overview
            </h2>
            <p className="text-sm text-gray-500">{periodLabel}</p>
          </div>
          <Link to="/provider/calendar" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
            <CalendarDays className="h-4 w-4" aria-hidden="true" /> Calendar view
          </Link>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-sm border border-gray-300 p-0.5" role="tablist" aria-label="Period type">
            {[
              ['month', 'Month'],
              ['custom', 'Date range'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => setMode(id)}
                className={`h-8 px-3 rounded-sm text-sm font-medium ${mode === id ? 'bg-indigo-500 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {mode === 'month' ? (
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="sr-only">Month</span>
              <input
                type="month"
                value={month}
                max={format(new Date(), 'yyyy-MM')}
                onChange={(e) => e.target.value && setMonth(e.target.value)}
                className="h-9 rounded-sm border border-gray-300 bg-white px-2 text-sm text-gray-900"
              />
            </label>
          ) : (
            <div className="inline-flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <label className="inline-flex items-center gap-1.5">
                From
                <input type="date" value={from} onChange={(e) => e.target.value && setFrom(e.target.value)} className="h-9 rounded-sm border border-gray-300 bg-white px-2 text-sm text-gray-900" />
              </label>
              <label className="inline-flex items-center gap-1.5">
                To
                <input type="date" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className="h-9 rounded-sm border border-gray-300 bg-white px-2 text-sm text-gray-900" />
              </label>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-md" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat icon={ClipboardList} label="Total orders" value={period.total} />
              <Stat icon={IndianRupee} label="Earnings (completed)" value={formatPrice(period.earnings)} />
              <Stat icon={Star} label={`Rating · ${stats.totalReviews} review${stats.totalReviews === 1 ? '' : 's'} (all time)`} value={Number(stats.averageRating) > 0 ? `${stats.averageRating} ★` : 'New'} />
              <Stat icon={Clock} label="Waiting for you" value={period.pending} highlight={period.pending > 0} />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {period.completed} completed · {period.scheduled} scheduled · {period.cancelled} cancelled
            </p>
          </>
        )}
      </section>

      {/* New orders */}
      <section className="mt-8" aria-labelledby="new-orders-title">
        <div className="flex items-center justify-between mb-3">
          <h2 id="new-orders-title" className="text-lg font-bold tracking-wide text-gray-900">
            New orders {newOrders.length > 0 && <span className="ml-1 rounded-sm bg-amber-100 px-2 py-0.5 text-sm text-amber-800">{newOrders.length}</span>}
          </h2>
          <Link to="/provider/trips" className="inline-flex items-center text-sm font-semibold text-indigo-600">
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
        <QuickLink to="/provider/trips" icon={ClipboardList} title="Upcoming jobs" value={loading ? '…' : `${upcoming.length} confirmed`} />
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
