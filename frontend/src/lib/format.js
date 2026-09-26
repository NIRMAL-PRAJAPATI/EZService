import { format, isToday, isTomorrow, isValid } from 'date-fns';

export const formatPrice = (value) => {
  const n = Number(value);
  if (value === null || value === undefined || value === '' || Number.isNaN(n)) return '—';
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const toDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isValid(d) ? d : null;
};

// "Today · 4:00 PM", "Tomorrow · 10:00 AM", "Sat, 28 Sep · 2:00 PM"
export const formatDateTime = (value) => {
  const d = toDate(value);
  if (!d) return value || 'Date not set';
  const day = isToday(d) ? 'Today' : isTomorrow(d) ? 'Tomorrow' : format(d, 'EEE, d MMM');
  return `${day} · ${format(d, 'h:mm a')}`;
};

export const formatDate = (value) => {
  const d = toDate(value);
  return d ? format(d, 'd MMM yyyy') : '';
};

// Order ids look like "1719912345678-4-7-2"; show a short, readable reference.
export const shortOrderId = (orderId) => {
  if (!orderId) return '';
  const first = String(orderId).split('-')[0];
  return `EZ${first.slice(-6)}`;
};

export const capitalize = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
