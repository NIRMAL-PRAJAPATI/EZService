import { useState } from 'react';
import { Navigation, MapPinCheck, BadgeCheck, Check, KeyRound } from 'lucide-react';
import authApi from '../../config/auth-config';
import Button from '../ui/Button';
import BottomSheet from '../ui/BottomSheet';
import PaymentSheet from './PaymentSheet';
import { InlineError } from '../ui/States';
import { orderStage } from '../ui/StatusBadge';
import { TRIP_CHANGED_EVENT } from './AvailabilityContext';
import { showTripDone } from './TripDoneOverlay';

const TRIP = [
  { key: 'START', label: 'Start trip', done: ['ON_THE_WAY', 'ARRIVED'], icon: Navigation, button: 'Start trip' },
  { key: 'ARRIVED', label: 'Reached location', done: ['ARRIVED'], icon: MapPinCheck, button: "I've reached the location" },
  { key: 'COMPLETE', label: 'Complete service', done: [], icon: BadgeCheck, button: 'Payment process' },
];

/**
 * Trip flow for an accepted order:
 *   1. Start trip → 2. Reached location (needs the customer's 4-digit code)
 *   → 3. Complete service (choose UPI / cash / net banking, then end the trip)
 */
export default function TripControls({ order, onUpdated, size = 'md' }) {
  const stage = orderStage(order);
  const nextIndex = stage === 'ARRIVED' ? 2 : stage === 'ON_THE_WAY' ? 1 : 0;
  const next = TRIP[nextIndex];
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [completeError, setCompleteError] = useState('');

  const moveTrip = (step, extra = {}) => {
    setBusy(step);
    setError('');
    setPinError('');
    setCompleteError('');
    return authApi
      .put(`/orders/${order.order_id}/trip`, { step, ...extra })
      .then((res) => {
        const o = res.data?.order || {};
        setPinOpen(false);
        setPayOpen(false);
        setPin('');
        if (step === 'COMPLETE') {
          showTripDone({ amount: order.estimated_charge || order.Service?.visiting_charge, mode: o.payment_mode || extra.payment_mode });
        }
        // Instant Service goes off when a trip starts; let the Online/Offline controls know
        window.dispatchEvent(new Event(TRIP_CHANGED_EVENT));
        onUpdated?.(order.order_id, {
          status: o.status,
          trip_status: o.trip_status,
          trip_updated: o.trip_updated,
          payment_mode: o.payment_mode,
          payment_status: o.payment_status,
          payment_ref: o.payment_ref,
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Couldn't update the trip. Please try again.";
        if (step === 'ARRIVED') setPinError(msg);
        else if (step === 'COMPLETE') setCompleteError(msg);
        else setError(msg);
      })
      .finally(() => setBusy(''));
  };

  const onPress = () => {
    if (next.key === 'START') moveTrip('START');
    else if (next.key === 'ARRIVED') {
      setPin('');
      setPinError('');
      setPinOpen(true);
    } else {
      setCompleteError('');
      setPayOpen(true);
    }
  };

  return (
    <div className="w-full">
      <ol className="grid grid-cols-3 gap-1.5 mb-3" aria-label="Trip progress">
        {TRIP.map((t, i) => {
          const done = t.done.includes(stage);
          const current = i === nextIndex;
          return (
            <li key={t.key} className="flex flex-col gap-1" aria-current={current ? 'step' : undefined}>
              <span className={`h-1.5 rounded-sm ${done ? 'bg-indigo-500' : current ? 'bg-indigo-200' : 'bg-gray-200'}`} />
              <span className={`text-[11px] font-medium leading-tight ${done ? 'text-indigo-600' : current ? 'text-gray-900' : 'text-gray-400'}`}>
                {done && <Check className="inline h-3 w-3 mr-0.5 -mt-0.5" aria-hidden="true" />}
                {i + 1}. {t.label}
              </span>
            </li>
          );
        })}
      </ol>

      <Button block size={size === 'lg' ? 'lg' : 'md'} variant={next.key === 'COMPLETE' ? 'success' : 'primary'} icon={next.icon} onClick={onPress} loading={busy === next.key}>
        {next.button}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Arrival verification */}
      <BottomSheet open={pinOpen} onClose={() => setPinOpen(false)} title="Enter customer's code" size="sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin.length === 4) moveTrip('ARRIVED', { pin });
          }}
          className="space-y-4 pt-1"
        >
          <p className="text-sm text-gray-600">
            Ask {order.CustomerInfo?.name || 'the customer'} for the 4-digit code shown in their booking. This confirms you are at the right place.
          </p>
          <label htmlFor={`pin-${order.order_id}`} className="sr-only">
            4-digit code
          </label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              id={`pin-${order.order_id}`}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              placeholder="• • • •"
              className="w-full h-14 rounded-sm border border-gray-300 bg-white pl-12 pr-4 text-center text-2xl font-bold tracking-[0.6em] text-gray-900 focus:border-indigo-500"
            />
          </div>
          <InlineError>{pinError}</InlineError>
          <Button type="submit" block disabled={pin.length !== 4} loading={busy === 'ARRIVED'}>
            Verify &amp; continue
          </Button>
        </form>
      </BottomSheet>

      {/* Complete service = take payment, then end the trip */}
      <PaymentSheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        order={order}
        onComplete={(mode) => moveTrip('COMPLETE', { payment_mode: mode })}
        completing={busy === 'COMPLETE'}
        completeError={completeError}
      />
    </div>
  );
}
