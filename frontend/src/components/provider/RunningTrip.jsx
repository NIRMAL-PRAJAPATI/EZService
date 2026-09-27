import { Link } from 'react-router-dom';
import { MapPin, Phone, Navigation2, Calendar, UserRound, Coffee } from 'lucide-react';
import TripControls from './TripControls';
import StatusBadge, { PROVIDER_ORDER_STATUS, orderStage } from '../ui/StatusBadge';
import { buttonClasses } from '../ui/Button';
import { formatDateTime, formatPrice, shortOrderId } from '../../lib/format';
import { directionsUrl, hasCoords, locationText } from '../../lib/geo';

/**
 * The provider's current job, big and easy to act on:
 * address + directions, call customer, the problem, and the next trip step.
 * `order` is the running trip, or the next accepted job when nothing is running.
 */
export default function RunningTrip({ order, running, onUpdated }) {
  if (!order) {
    return (
      <section className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center" aria-label="Running trip">
        <Coffee className="mx-auto h-8 w-8 text-gray-300" aria-hidden="true" />
        <p className="mt-2 font-semibold text-gray-900">No trip running</p>
        <p className="text-sm text-gray-500">When you accept a booking, you can start the trip from here.</p>
      </section>
    );
  }

  const stage = orderStage(order);
  const customer = order.CustomerInfo || {};
  const amount = order.estimated_charge || order.Service?.visiting_charge;
  // Directions go to the customer's live location when we have it
  const mapsUrl = directionsUrl(order);

  return (
    <section className={`rounded-md border-2 bg-white overflow-hidden ${running ? 'border-indigo-500' : 'border-gray-200'}`} aria-labelledby="running-title">
      <div className={`flex items-center justify-between gap-3 px-4 py-2.5 ${running ? 'bg-indigo-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
        <h2 id="running-title" className="text-sm font-bold uppercase tracking-wide">
          {running ? 'Running trip' : 'Next job'}
        </h2>
        <span className={`text-xs ${running ? 'text-indigo-100' : 'text-gray-500'}`}>#{shortOrderId(order.order_id)}</span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900 truncate">{order.Service?.name || 'Service'}</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-600">
              <UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" /> {customer.name || 'Customer'}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" /> {formatDateTime(order.date)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-gray-900">{formatPrice(amount)}</p>
            <StatusBadge status={stage} map={PROVIDER_ORDER_STATUS} />
          </div>
        </div>

        {(order.location || hasCoords(order)) && (
          <div className="flex items-start gap-2 rounded-sm bg-gray-50 px-3 py-2.5">
            <MapPin className="h-5 w-5 mt-0.5 text-indigo-500 shrink-0" aria-hidden="true" />
            <p className="text-sm text-gray-900">{locationText(order)}</p>
          </div>
        )}

        {order.issue && (
          <div>
            <p className="text-xs font-medium text-gray-500">Problem</p>
            <p className="text-sm text-gray-800">{order.issue}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {mapsUrl ? (
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={buttonClasses({ variant: 'secondary' })}>
              <Navigation2 className="h-4 w-4" aria-hidden="true" /> Directions
            </a>
          ) : (
            <span />
          )}
          {customer.mobile ? (
            <a href={`tel:${customer.mobile}`} className={buttonClasses({ variant: 'secondary' })}>
              <Phone className="h-4 w-4" aria-hidden="true" /> Call
            </a>
          ) : (
            <Link to={`/provider/orders/${order.order_id}/view`} className={buttonClasses({ variant: 'secondary' })}>
              Details
            </Link>
          )}
        </div>

        <TripControls order={order} onUpdated={onUpdated} size="lg" />
      </div>
    </section>
  );
}
