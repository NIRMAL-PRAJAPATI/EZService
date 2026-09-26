import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, XCircle, BadgeCheck, MessageSquareWarning, ChevronRight, LogIn } from 'lucide-react';
import authApi from '../config/auth-config';
import ProfileNav from '../components/Profile/user/ProfileNav';
import { CardListSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { normalizeStatus } from '../components/ui/StatusBadge';
import { getAuthUser } from '../lib/auth';
import { formatDateTime } from '../lib/format';

// Notifications are built from the customer's real bookings and complaints.
const ORDER_NOTE = {
  PENDING: { icon: Clock, tone: 'bg-amber-50 text-amber-700', text: (o) => `Booking placed. Waiting for ${o.ProviderInfo?.name || 'the provider'} to confirm.` },
  CONFIRMED: { icon: CheckCircle2, tone: 'bg-green-50 text-green-700', text: (o) => `${o.ProviderInfo?.name || 'Your provider'} confirmed your booking.` },
  COMPLETED: { icon: BadgeCheck, tone: 'bg-indigo-50 text-indigo-700', text: () => 'Service completed. Tap to rate your experience.' },
  CANCELLED: { icon: XCircle, tone: 'bg-red-50 text-red-700', text: () => 'This booking was cancelled.' },
};
const COMPLAINT_TEXT = { OPEN: 'was received', IN_PROGRESS: 'is being looked into', RESOLVED: 'has been resolved', REJECTED: 'was closed' };

export default function Notifications() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      authApi.get('/orders/customer/').then((r) => r.data).catch((e) => (e.response?.status === 404 ? [] : Promise.reject(e))),
      authApi.get('/complaints/customer').then((r) => r.data).catch(() => []),
    ])
      .then(([orders, complaints]) => {
        const fromOrders = (Array.isArray(orders) ? orders : []).map((o) => {
          const status = normalizeStatus(o.status);
          const meta = ORDER_NOTE[status] || ORDER_NOTE.PENDING;
          return {
            key: `o-${o.order_id}`,
            title: o.Service?.name || 'Booking',
            text: meta.text(o),
            icon: meta.icon,
            tone: meta.tone,
            when: o.updated || o.created || o.date,
            to: `/orders/${o.order_id}/view`,
          };
        });
        const fromComplaints = (Array.isArray(complaints) ? complaints : []).map((c) => ({
          key: `c-${c.id}`,
          title: `Complaint: ${c.subject || 'Issue'}`,
          text: `Your complaint about ${c.Service?.name || 'a booking'} ${COMPLAINT_TEXT[c.status] || 'was updated'}.`,
          icon: MessageSquareWarning,
          tone: c.status === 'RESOLVED' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700',
          when: c.created,
          to: '/complaint',
        }));
        setItems([...fromOrders, ...fromComplaints].sort((a, b) => new Date(b.when || 0) - new Date(a.when || 0)));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user?.role === 'customer') load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-100 min-h-full">
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8 font-sans">
        <ProfileNav />

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1 px-4 sm:px-0">
            <h3 className="text-xl font-medium text-gray-900">Notifications</h3>
            <p className="mt-1 text-gray-600">Updates on your bookings and complaints.</p>
          </div>

          <div className="mt-5 md:col-span-2 md:mt-0">
            {user?.role !== 'customer' ? (
              <div className="bg-white shadow sm:rounded-lg">
                <EmptyState icon={LogIn} title="Log in to see notifications" actionLabel="Log in" onAction={() => navigate('/login', { state: { from: '/notifications' } })} />
              </div>
            ) : loading ? (
              <CardListSkeleton count={3} />
            ) : error ? (
              <div className="bg-white shadow sm:rounded-lg">
                <ErrorState description="We couldn't load your notifications." onRetry={load} />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white shadow sm:rounded-lg">
                <EmptyState icon={Bell} title="No notifications yet" description="Updates about your bookings will show up here." actionLabel="Browse services" actionTo="/services" />
              </div>
            ) : (
              <ul className="bg-white shadow sm:rounded-lg divide-y divide-gray-100 overflow-hidden">
                {items.map(({ key, title, text, icon: Icon, tone, when, to }) => (
                  <li key={key}>
                    <Link to={to} className="flex items-start gap-3 px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <span className={`mt-0.5 h-9 w-9 shrink-0 rounded-sm flex items-center justify-center ${tone}`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-gray-900 truncate">{title}</span>
                        <span className="block text-sm text-gray-600">{text}</span>
                        {when && <span className="block text-xs text-gray-400 mt-0.5">{formatDateTime(when)}</span>}
                      </span>
                      <ChevronRight className="h-5 w-5 self-center text-gray-300" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
