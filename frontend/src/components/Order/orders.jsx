import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, LogIn } from 'lucide-react';
import authApi from '../../config/auth-config';
import BookingCard from '../booking/BookingCard';
import Tabs from '../ui/Tabs';
import { CardListSkeleton } from '../ui/Skeleton';
import { EmptyState, ErrorState } from '../ui/States';
import { normalizeStatus } from '../ui/StatusBadge';
import { getAuthUser } from '../../lib/auth';

const TABS = [
  { id: 'upcoming', label: 'Upcoming', match: ['PENDING', 'CONFIRMED'], empty: 'Your upcoming services will appear here.' },
  { id: 'completed', label: 'Completed', match: ['COMPLETED'], empty: 'Completed services will appear here.' },
  { id: 'cancelled', label: 'Cancelled', match: ['CANCELLED'], empty: 'Cancelled bookings will appear here.' },
];

/** Customer "Bookings" page (route /order). */
const OrderPage = () => {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState('upcoming');

  const load = () => {
    setLoading(true);
    setError(false);
    authApi
      .get('/orders/customer/')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        // The API answers 404 when there are no orders yet.
        if (err.response?.status === 404) setOrders([]);
        else setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === 'customer') load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const c = {};
    TABS.forEach((t) => {
      c[t.id] = orders.filter((o) => t.match.includes(normalizeStatus(o.status))).length;
    });
    return c;
  }, [orders]);

  const activeTab = TABS.find((t) => t.id === tab);
  const list = orders.filter((o) => activeTab.match.includes(normalizeStatus(o.status)));

  if (user?.role !== 'customer') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">Bookings</h1>
        <EmptyState icon={LogIn} title="Log in to see your bookings" description="Track upcoming visits and past services in one place." actionLabel="Log in" onAction={() => navigate('/login', { state: { from: '/order' } })} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0 py-5 md:py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900">Bookings</h1>

      <Tabs
        className="mt-4"
        label="Booking status"
        stretch
        value={tab}
        onChange={setTab}
        tabs={TABS.map((t) => ({ id: t.id, label: t.label, count: loading ? 0 : counts[t.id] }))}
      />

      <div className="mt-4" role="tabpanel">
        {loading ? (
          <CardListSkeleton count={3} />
        ) : error ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <ErrorState description="We couldn't load your bookings. Please try again." onRetry={load} />
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <EmptyState
              icon={ClipboardList}
              title={tab === 'upcoming' ? 'No upcoming bookings' : `No ${activeTab.label.toLowerCase()} bookings`}
              description={activeTab.empty}
              actionLabel={tab === 'upcoming' ? 'Browse services' : undefined}
              actionTo={tab === 'upcoming' ? '/services' : undefined}
            />
          </div>
        ) : (
          <ul className="space-y-3">
            {list.map((order) => (
              <li key={order.order_id}>
                <BookingCard order={order} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
