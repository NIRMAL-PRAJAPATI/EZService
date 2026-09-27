import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import authApi from '../config/auth-config';
import { ProviderPage } from '../components/layout/ProviderLayout';
import ProviderOrderCard from '../components/provider/ProviderOrderCard';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { formatPrice } from '../lib/format';
import { dayKey, inRange, orderDate, summarize } from '../lib/orderStats';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Month calendar of the provider's orders: per day how many are scheduled, completed or cancelled. */
export default function ProviderCalendar() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const [selected, setSelected] = useState(new Date());

  const load = () => {
    setLoading(true);
    setError(false);
    authApi
      .get('/orders/provider?all=true')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Orders grouped by visit day
  const byDay = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const d = orderDate(o);
      if (!d) return;
      (map[dayKey(d)] = map[dayKey(d)] || []).push(o);
    });
    return map;
  }, [orders]);

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) }),
    [month]
  );

  const monthSummary = useMemo(() => summarize(inRange(orders, { from: startOfMonth(month), to: endOfMonth(month) })), [orders, month]);
  const dayOrders = (byDay[dayKey(selected)] || []).sort((a, b) => orderDate(a) - orderDate(b));
  const daySummary = summarize(dayOrders);

  const onUpdated = (orderId, patch) => setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, ...patch } : o)));

  const goMonth = (delta) => {
    const next = addMonths(month, delta);
    setMonth(next);
    setSelected(isSameMonth(next, new Date()) ? new Date() : next);
  };

  return (
    <ProviderPage title="Calendar" subtitle="Your orders day by day.">
      {error ? (
        <ErrorState description="We couldn't load your orders." onRetry={load} />
      ) : (
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6">
          <section aria-label="Month">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => goMonth(-1)} className="h-10 w-10 rounded-sm border border-gray-300 flex items-center justify-center hover:bg-gray-50" aria-label="Previous month">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-bold tracking-wide text-gray-900">{format(month, 'MMMM yyyy')}</h2>
              <button type="button" onClick={() => goMonth(1)} className="h-10 w-10 rounded-sm border border-gray-300 flex items-center justify-center hover:bg-gray-50" aria-label="Next month">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <p className="mb-3 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{monthSummary.total}</span> orders · {monthSummary.completed} completed · {monthSummary.scheduled} scheduled ·{' '}
              {monthSummary.cancelled} cancelled · <span className="font-semibold text-gray-900">{formatPrice(monthSummary.earnings)}</span> earned
            </p>

            <div className="grid grid-cols-7 border-t border-l border-gray-200 rounded-sm overflow-hidden">
              {WEEKDAYS.map((w) => (
                <div key={w} className="border-r border-b border-gray-200 bg-gray-50 py-1.5 text-center text-xs font-semibold text-gray-500">
                  {w}
                </div>
              ))}
              {days.map((d) => {
                const list = byDay[dayKey(d)] || [];
                const sum = summarize(list);
                const inMonth = isSameMonth(d, month);
                const isSel = isSameDay(d, selected);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => setSelected(d)}
                    aria-pressed={isSel}
                    aria-label={`${format(d, 'd MMMM')}: ${sum.total} orders`}
                    className={`relative min-h-16 sm:min-h-20 border-r border-b border-gray-200 p-1 sm:p-1.5 text-left align-top transition-colors ${
                      isSel ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-500' : inMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday(d) ? 'bg-indigo-500 text-white' : inMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {format(d, 'd')}
                    </span>
                    {loading ? (
                      <Skeleton className="mt-1 h-3 w-8" />
                    ) : (
                      sum.total > 0 && (
                        <span className="mt-0.5 flex flex-wrap gap-0.5 text-[10px] sm:text-[11px] font-semibold leading-none">
                          {sum.scheduled > 0 && <span className="rounded-sm bg-amber-100 text-amber-800 px-1 py-0.5">{sum.scheduled}</span>}
                          {sum.completed > 0 && <span className="rounded-sm bg-green-100 text-green-800 px-1 py-0.5">{sum.completed}</span>}
                          {sum.cancelled > 0 && <span className="rounded-sm bg-red-100 text-red-700 px-1 py-0.5">{sum.cancelled}</span>}
                        </span>
                      )
                    )}
                  </button>
                );
              })}
            </div>

            <ul className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500" aria-label="Legend">
              <li className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-amber-100 ring-1 ring-amber-300" /> Scheduled</li>
              <li className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-green-100 ring-1 ring-green-300" /> Completed</li>
              <li className="inline-flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-red-100 ring-1 ring-red-300" /> Cancelled</li>
            </ul>
          </section>

          <section className="mt-6 lg:mt-0" aria-labelledby="day-title">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <h2 id="day-title" className="text-lg font-bold tracking-wide text-gray-900">
                {isToday(selected) ? 'Today' : format(selected, 'EEE, d MMMM')}
              </h2>
              {!isToday(selected) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setMonth(startOfMonth(new Date()));
                    setSelected(new Date());
                  }}
                >
                  Today
                </Button>
              )}
            </div>
            <p className="mb-3 text-sm text-gray-500">
              {daySummary.total} order{daySummary.total === 1 ? '' : 's'} · {daySummary.completed} completed · {daySummary.scheduled} scheduled
              {daySummary.earnings > 0 ? ` · ${formatPrice(daySummary.earnings)} earned` : ''}
            </p>
            {loading ? (
              <Skeleton className="h-40 w-full rounded-md" />
            ) : dayOrders.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white">
                <EmptyState icon={CalendarDays} title="No orders this day" description="Pick another day to see its orders." />
              </div>
            ) : (
              <div className="space-y-3">
                {dayOrders.map((o) => (
                  <ProviderOrderCard key={o.order_id} order={o} onUpdated={onUpdated} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </ProviderPage>
  );
}
