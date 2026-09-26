import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import ServiceImage from '../ui/ServiceImage';
import { formatDateTime, formatPrice } from '../../lib/format';

/** One booking in the customer's Bookings list. Status is the most visible element. */
export default function BookingCard({ order }) {
  const amount = order.estimated_charge || order.Service?.visiting_charge;
  return (
    <Link
      to={`/orders/${order.order_id}/view`}
      className="block rounded-md border border-gray-200 bg-white p-4 hover:border-indigo-300 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={order.status} size="lg" />
        <span className="text-base font-semibold text-gray-900">{formatPrice(amount)}</span>
      </div>
      <div className="mt-3 flex gap-3">
        <ServiceImage src={order.Service?.cover_image} alt={order.Service?.name} className="h-14 w-14 shrink-0 rounded-sm" iconClassName="h-6 w-6" />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{order.Service?.name || 'Service'}</h3>
          <p className="text-sm text-gray-600 truncate">{order.ProviderInfo?.name || 'Service provider'}</p>
          <p className="text-sm text-gray-500">{formatDateTime(order.date || order.created)}</p>
        </div>
        <ChevronRight className="h-5 w-5 self-center text-gray-400" aria-hidden="true" />
      </div>
    </Link>
  );
}
