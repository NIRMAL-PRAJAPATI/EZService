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
      .get('/orders/provider')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);

  const counts = useMemo(() => {
    const c = { ALL: orders.length };
    orders.forEach((o) => {
      const s = normalizeStatus(o.status);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [orders]);

  const list = tab === 'ALL' ? orders : orders.filter((o) => normalizeStatus(o.status) === tab);
  const onUpdated = (orderId, status) => setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, status } : o)));

  return (
    <ProviderPage
      title="Orders"
      subtitle="Accept new bookings and keep track of your jobs."
      actions={
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchOrders} loading={loading}>
          Refresh
        </Button>
      }
    >
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
          {list.map((o) => (
            <ProviderOrderCard key={o.order_id} order={o} onUpdated={onUpdated} />
          ))}
        </div>
      )}
    </ProviderPage>
  );
}

export default ProviderOrder;
