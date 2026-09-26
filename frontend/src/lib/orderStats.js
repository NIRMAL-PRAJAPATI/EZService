import { endOfDay, endOfMonth, format, isValid, startOfDay, startOfMonth } from 'date-fns';
import { normalizeStatus } from '../components/ui/StatusBadge';

// The day a booking happens: the visit date, or when it was created.
export const orderDate = (o) => {
  const d = new Date(o?.date || o?.created);
  return isValid(d) ? d : null;
};

export const dayKey = (d) => format(d, 'yyyy-MM-dd');

export const orderAmount = (o) => Number(o?.estimated_charge || o?.Service?.visiting_charge || 0);

// { from, to } for "YYYY-MM"
export const monthRange = (month) => {
  const d = new Date(`${month}-01T00:00:00`);
  return { from: startOfMonth(d), to: endOfMonth(d) };
};

export const dayRange = (fromStr, toStr) => ({
  from: startOfDay(new Date(`${fromStr}T00:00:00`)),
  to: endOfDay(new Date(`${toStr}T00:00:00`)),
});

export const inRange = (orders, { from, to }) =>
  orders.filter((o) => {
    const d = orderDate(o);
    return d && d >= from && d <= to;
  });

// Counts for a list of orders
export const summarize = (orders) => {
  const s = { total: orders.length, pending: 0, scheduled: 0, completed: 0, cancelled: 0, earnings: 0 };
  orders.forEach((o) => {
    const st = normalizeStatus(o.status);
    if (st === 'PENDING') s.pending += 1;
    if (st === 'PENDING' || st === 'CONFIRMED') s.scheduled += 1;
    if (st === 'COMPLETED') {
      s.completed += 1;
      s.earnings += orderAmount(o);
    }
    if (st === 'CANCELLED') s.cancelled += 1;
  });
  return s;
};
