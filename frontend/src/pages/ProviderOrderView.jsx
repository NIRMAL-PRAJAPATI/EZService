import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail } from 'lucide-react';
import authApi from '../config/auth-config';
import { ProviderPage } from '../components/layout/ProviderLayout';
import ProviderOrderCard from '../components/provider/ProviderOrderCard';
import BookingTimeline from '../components/booking/BookingTimeline';
import Button from '../components/ui/Button';
import { PageSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { normalizeStatus, orderStage } from '../components/ui/StatusBadge';

function ProviderOrderView() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    authApi
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [orderId]);

  const back = (
    <Link to="/provider/trips" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Orders
    </Link>
  );

  if (loading) return <PageSkeleton />;
  if (error || !order) {
    return (
      <ProviderPage width="max-w-2xl">
        {back}
        <ErrorState title="Order not found" description="It may have been removed." onRetry={load} />
      </ProviderPage>
    );
  }

  const customer = order.CustomerInfo || {};
  const active = ['PENDING', 'CONFIRMED'].includes(normalizeStatus(order.status));

  return (
    <ProviderPage width="max-w-2xl">
      {back}
      <h1 className="text-2xl font-extrabold tracking-wide text-gray-900 mb-4">Order details</h1>
      <div className="space-y-4">
        <ProviderOrderCard order={order} showDetailsLink={false} onUpdated={(_, patch) => setOrder((o) => ({ ...o, ...patch }))} />

        <section className="rounded-md border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Status</h2>
          <BookingTimeline status={orderStage(order)} order={order} viewer="provider" />
        </section>

        <section className="rounded-md border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Customer</h2>
          <p className="font-semibold text-gray-900">{customer.name || 'Customer'}</p>
          {customer.email && <p className="text-sm text-gray-600 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" aria-hidden="true" /> {customer.email}</p>}
          {customer.mobile && active && (
            <Button variant="secondary" icon={Phone} href={`tel:${customer.mobile}`} block className="mt-4">
              Call customer
            </Button>
          )}
        </section>
      </div>
    </ProviderPage>
  );
}

export default ProviderOrderView;
