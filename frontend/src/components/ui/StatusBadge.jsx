import { CheckCircle2, Clock, XCircle, BadgeCheck, CircleDot, Navigation, MapPinCheck } from 'lucide-react';

// Customer-facing wording for the order statuses stored in the database.
export const ORDER_STATUS = {
  PENDING: { label: 'Waiting for provider', tone: 'amber', icon: Clock },
  CONFIRMED: { label: 'Provider confirmed', tone: 'green', icon: CheckCircle2 },
  ON_THE_WAY: { label: 'Provider on the way', tone: 'indigo', icon: Navigation },
  ARRIVED: { label: 'Provider arrived', tone: 'green', icon: MapPinCheck },
  COMPLETED: { label: 'Completed', tone: 'indigo', icon: BadgeCheck },
  CANCELLED: { label: 'Cancelled', tone: 'red', icon: XCircle },
};

// Provider-facing wording for the same statuses.
export const PROVIDER_ORDER_STATUS = {
  PENDING: { label: 'New request', tone: 'amber', icon: Clock },
  CONFIRMED: { label: 'Accepted', tone: 'green', icon: CheckCircle2 },
  ON_THE_WAY: { label: 'On the way', tone: 'indigo', icon: Navigation },
  ARRIVED: { label: 'At location', tone: 'green', icon: MapPinCheck },
  COMPLETED: { label: 'Completed', tone: 'indigo', icon: BadgeCheck },
  CANCELLED: { label: 'Cancelled', tone: 'red', icon: XCircle },
};

export const COMPLAINT_STATUS = {
  OPEN: { label: 'Open', tone: 'red', icon: CircleDot },
  IN_PROGRESS: { label: 'In progress', tone: 'amber', icon: Clock },
  RESOLVED: { label: 'Resolved', tone: 'green', icon: CheckCircle2 },
  REJECTED: { label: 'Closed', tone: 'gray', icon: XCircle },
};

const TONES = {
  green: 'bg-green-50 text-green-700 ring-green-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  gray: 'bg-gray-100 text-gray-700 ring-gray-500/20',
};

// Where a booking is right now, including the provider's trip progress.
// Returns PENDING, CONFIRMED, ON_THE_WAY, ARRIVED, COMPLETED or CANCELLED.
export const orderStage = (order) => {
  const status = normalizeStatus(order?.status);
  if (status === 'CONFIRMED' && (order?.trip_status === 'ON_THE_WAY' || order?.trip_status === 'ARRIVED')) return order.trip_status;
  return status;
};

export const normalizeStatus = (status) => {
  const s = String(status || 'PENDING').toUpperCase();
  if (s === 'ACCEPTED') return 'CONFIRMED';
  if (s === 'REJECTED' || s === 'DECLINED') return 'CANCELLED';
  if (s === 'FULFILLED') return 'COMPLETED';
  return s;
};

export default function StatusBadge({ status, map = ORDER_STATUS, size = 'sm', className = '' }) {
  const key = map === COMPLAINT_STATUS ? String(status || 'OPEN').toUpperCase() : normalizeStatus(status);
  const meta = map[key] || { label: String(status || 'Unknown'), tone: 'gray', icon: CircleDot };
  const Icon = meta.icon;
  const sizing = size === 'lg' ? 'text-sm px-3 py-1.5 gap-1.5' : 'text-xs px-2 py-1 gap-1';
  return (
    <span className={`inline-flex items-center rounded-sm font-semibold ring-1 ring-inset whitespace-nowrap ${TONES[meta.tone]} ${sizing} ${className}`}>
      <Icon className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
