import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { normalizeStatus } from '../ui/StatusBadge';
import { formatPrice } from '../../lib/format';
import { paymentLabel } from '../../lib/payment';

// Only the states the backend actually records are shown.
const STEPS = {
  customer: [
    { key: 'PENDING', title: 'Booking placed', text: 'Waiting for the provider to confirm.' },
    { key: 'CONFIRMED', title: 'Provider confirmed', text: 'The provider will start the trip at the booked time.' },
    { key: 'ON_THE_WAY', title: 'Provider on the way', text: 'Your professional has started the trip to your location.' },
    { key: 'ARRIVED', title: 'Reached your location', text: 'Your professional is at your place and working on it.' },
    { key: 'PAID', title: 'Payment', text: '' },
    { key: 'COMPLETED', title: 'Service completed', text: 'Rate your experience to help others.' },
  ],
  provider: [
    { key: 'PENDING', title: 'Booking placed', text: 'Accept or decline this booking.' },
    { key: 'CONFIRMED', title: 'You confirmed', text: 'Start the trip at the booked time.' },
    { key: 'ON_THE_WAY', title: 'On the way', text: "You're travelling to the customer's location." },
    { key: 'ARRIVED', title: "Reached customer's location", text: 'Finish the work, then take the payment.' },
    { key: 'PAID', title: 'Payment', text: '' },
    { key: 'COMPLETED', title: 'Service completed', text: 'This job is done.' },
  ],
};

// Text for the payment step, from the order's payment fields
const paymentStep = (order, state, viewer) => {
  const mode = order?.payment_mode;
  const amount = formatPrice(order?.estimated_charge || order?.Service?.visiting_charge);
  if (state === 'done') return { title: 'Payment successful', text: mode ? `${amount} · ${paymentLabel(mode)}` : undefined, showText: true };
  if (state !== 'current') return { title: 'Payment' };
  if (order?.payment_status === 'CUSTOMER_PAID') {
    return { title: 'Payment sent', text: viewer === 'provider' ? 'Check the money reached you, then end the trip.' : 'Waiting for the provider to confirm they received it.' };
  }
  return {
    title: 'Payment',
    text: mode === 'CASH' ? `Pay ${amount} in cash.` : mode ? `Waiting for ${amount} by ${paymentLabel(mode)}.` : undefined,
  };
};

/**
 * status: the order stage (orderStage(order)).
 * order: optional, adds the payment step details. viewer: 'customer' | 'provider'.
 */
export default function BookingTimeline({ status, order, viewer = 'customer' }) {
  let current = normalizeStatus(status);
  // Once the provider has asked for payment, the payment step is the live one
  if (current === 'ARRIVED' && order?.payment_mode) current = 'PAID';
  // Bookings completed before payments were recorded have no payment step
  const steps = (STEPS[viewer] || STEPS.customer).filter((s) => s.key !== 'PAID' || !(current === 'COMPLETED' && order && !order.payment_mode));

  if (current === 'CANCELLED') {
    return (
      <ol className="space-y-0">
        <TimelineItem title="Booking placed" state="done" last={false} />
        <TimelineItem title="Booking cancelled" text="This booking will not go ahead." state="cancelled" last />
      </ol>
    );
  }

  const currentIndex = Math.max(0, steps.findIndex((s) => s.key === current));
  return (
    <ol>
      {steps.map((step, i) => {
        const state = i < currentIndex || current === 'COMPLETED' ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        if (step.key === 'PAID') {
          const p = paymentStep(order, state, viewer);
          return <TimelineItem key={step.key} title={p.title} text={state === 'current' || p.showText ? p.text : undefined} state={state} last={i === steps.length - 1} />;
        }
        return <TimelineItem key={step.key} title={step.title} text={state === 'current' ? step.text : undefined} state={state} last={i === steps.length - 1} />;
      })}
    </ol>
  );
}

function TimelineItem({ title, text, state, last }) {
  const dot =
    state === 'done'
      ? 'bg-indigo-500 text-white'
      : state === 'current'
        ? 'bg-white border-2 border-indigo-500'
        : state === 'cancelled'
          ? 'bg-red-600 text-white'
          : 'bg-white border-2 border-gray-300';
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0" aria-current={state === 'current' ? 'step' : undefined}>
      {!last && <span className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${state === 'done' ? 'bg-indigo-500' : 'bg-gray-200'}`} aria-hidden="true" />}
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`relative z-10 mt-0.5 h-6 w-6 shrink-0 rounded-full flex items-center justify-center ${dot}`}
      >
        {state === 'done' && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
        {state === 'cancelled' && <X className="h-3.5 w-3.5" aria-hidden="true" />}
        {state === 'current' && <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />}
      </motion.span>
      <div>
        <p className={`text-sm font-semibold ${state === 'upcoming' ? 'text-gray-400' : state === 'cancelled' ? 'text-red-700' : 'text-gray-900'}`}>{title}</p>
        {text && <p className="text-sm text-gray-500">{text}</p>}
      </div>
    </li>
  );
}
