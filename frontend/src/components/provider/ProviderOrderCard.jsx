import { useState } from 'react';
import { MapPin, Calendar, UserRound } from 'lucide-react';
import TripControls from './TripControls';
import authApi from '../../config/auth-config';
import StatusBadge, { PROVIDER_ORDER_STATUS, normalizeStatus, orderStage } from '../ui/StatusBadge';
import Button from '../ui/Button';
import { ConfirmSheet } from '../ui/BottomSheet';
import { formatDateTime, formatPrice, shortOrderId } from '../../lib/format';
import { paymentLabel } from '../../lib/payment';
import { locationText } from '../../lib/geo';

/**
 * One order on the provider side, with the next action:
 *  PENDING → Accept / Decline
 *  CONFIRMED → 1. Start trip → 2. Reached location → 3. Complete service
 */
export default function ProviderOrderCard({ order, onUpdated, showDetailsLink = true }) {
  const [busy, setBusy] = useState('');
  const [confirm, setConfirm] = useState(null); // 'decline'
  const [error, setError] = useState('');
  const status = normalizeStatus(order.status);
  const stage = orderStage(order);
  const amount = order.estimated_charge || order.Service?.visiting_charge;

  const update = (apiStatus, nextStatus) => {
    setBusy(apiStatus);
    setError('');
    authApi
      .put(`/orders/${order.order_id}/status`, { status: apiStatus })
      .then(() => {
        setConfirm(null);
        onUpdated?.(order.order_id, { status: nextStatus });
      })
      .catch((err) => setError(err.response?.data?.message || "Couldn't update this order. Please try again."))
      .finally(() => setBusy(''));
  };


  return (
    <article className={`rounded-md border bg-white p-4 ${status === 'PENDING' ? 'border-amber-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{order.Service?.name || 'Service'}</p>
          <p className="text-xs text-gray-400">#{shortOrderId(order.order_id)}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gray-900">{formatPrice(amount)}</p>
          <StatusBadge status={stage} map={PROVIDER_ORDER_STATUS} />
          {status === 'COMPLETED' && order.payment_mode && <p className="mt-1 text-xs text-gray-500">Paid by {paymentLabel(order.payment_mode)}</p>}
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" /> {order.CustomerInfo?.name || 'Customer'}
        </li>
        <li className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" /> {formatDateTime(order.date)}
        </li>
        {order.location && (
          <li className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" aria-hidden="true" /> <span className="line-clamp-2">{locationText(order)}</span>
          </li>
        )}
      </ul>
      {order.issue && <p className="mt-3 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700 line-clamp-3">{order.issue}</p>}

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {status === 'PENDING' && (
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm('decline')} disabled={!!busy}>
              Decline
            </Button>
            <Button className="flex-1" onClick={() => update('accepted', 'CONFIRMED')} loading={busy === 'accepted'}>
              Accept
            </Button>
          </>
        )}
        {status === 'CONFIRMED' && <TripControls order={order} onUpdated={onUpdated} />}
        {showDetailsLink && (
          <Button variant="ghost" to={`/provider/orders/${order.order_id}/view`} className={status === 'PENDING' ? '' : status === 'CONFIRMED' ? 'w-full' : 'flex-1'}>
            Details
          </Button>
        )}
      </div>

      <ConfirmSheet
        open={confirm === 'decline'}
        onClose={() => setConfirm(null)}
        title="Decline this order?"
        description={`${order.CustomerInfo?.name || 'The customer'} will see that you can't take this booking.`}
        confirmLabel="Decline order"
        cancelLabel="Go back"
        onConfirm={() => update('rejected', 'CANCELLED')}
        loading={busy === 'rejected'}
      />
    </article>
  );
}

