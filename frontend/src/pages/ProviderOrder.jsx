import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, RefreshCw } from 'lucide-react';
import authApi from '../config/auth-config';
import { ProviderPage } from '../components/layout/ProviderLayout';
import ProviderOrderCard from '../components/provider/ProviderOrderCard';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { CardListSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { normalizeStatus } from '../components/ui/StatusBadge';
import RunningTrip from '../components/provider/RunningTrip';
import { io } from 'socket.io-client';
import { getAuthUser } from '../lib/auth';

const TABS = [
  { id: 'PENDING', label: 'New' },
  { id: 'CONFIRMED', label: 'Accepted' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CANCELLED', label: 'Cancelled' },
  { id: 'ALL', label: 'All' },
];

function ProviderOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState('PENDING');

  const fetchOrders = () => {
    setLoading(true);
    setError(false);
    authApi
      .get('/orders/provider?all=true')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);

  // Live: status/trip changes (and cancellations) arrive without refreshing
  useEffect(() => {
    const user = getAuthUser();
    const socket = io(import.meta.env.VITE_API_BACKEND_API || 'http://localhost:3000');
    if (user?.id) socket.emit('identify', { userType: 'provider', userId: user.id });
    socket.on('orderUpdate', (u) => setOrders((prev) => prev.map((o) => (o.order_id === u?.order_id ? { ...o, ...u } : o))));
    return () => socket.disconnect();
  }, []);

  // The running trip (started, not finished) — otherwise the next accepted job
  const { current, running } = useMemo(() => {
    const accepted = orders.filter((o) => normalizeStatus(o.status) === 'CONFIRMED');
    const active = accepted
      .filter((o) => o.trip_status === 'ON_THE_WAY' || o.trip_status === 'ARRIVED')
      .sort((a, b) => new Date(b.trip_updated || 0) - new Date(a.trip_updated || 0))[0];
    if (active) return { current: active, running: true };
    const nextJob = [...accepted].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))[0];
    return { current: nextJob || null, running: false };
  }, [orders]);

  const counts = useMemo(() => {
    const c = { ALL: orders.length };
    orders.forEach((o) => {
      const s = normalizeStatus(o.status);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [orders]);

  const list = tab === 'ALL' ? orders : orders.filter((o) => normalizeStatus(o.status) === tab);
  const onUpdated = (orderId, patch) => setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, ...patch } : o)));

  return (
    <ProviderPage
      title="Running trip"
      subtitle="Your current job first, then all your orders."
      actions={
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchOrders} loading={loading}>
          Refresh
        </Button>
      }
    >
      {!loading && !error && (
        <div className="mb-8">
          <RunningTrip order={current} running={running} onUpdated={onUpdated} />
        </div>
      )}

      <h2 className="text-lg font-bold tracking-wide text-gray-900 mb-2">Orders</h2>
      <Tabs
        className="mb-4"
        label="Order status"
        value={tab}
        onChange={setTab}
        tabs={TABS.map((t) => ({ id: t.id, label: t.label, count: counts[t.id] || 0 }))}
      />

      {loading ? (
        <CardListSkeleton count={3} />
      ) : error ? (
        <div className="rounded-md border border-gray-200 bg-white">
          <ErrorState description="We couldn't load your orders." onRetry={fetchOrders} />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white">
          <EmptyState
            icon={ClipboardList}
            title={tab === 'PENDING' ? 'No new orders' : 'Nothing here'}
            description={tab === 'PENDING' ? 'New bookings from customers will appear here.' : 'Orders with this status will appear here.'}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {list.filter((o) => o.order_id !== current?.order_id || tab !== 'CONFIRMED').map((o) => (
            <ProviderOrderCard key={o.order_id} order={o} onUpdated={onUpdated} />
          ))}
        </div>
      )}
    </ProviderPage>
  );
}

export default ProviderOrder;
