import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { normalizeStatus } from '../ui/StatusBadge';

// Only the states the backend actually records are shown.
const STEPS = [
  { key: 'PENDING', title: 'Booking placed', text: 'Waiting for the provider to confirm.' },
  { key: 'CONFIRMED', title: 'Provider confirmed', text: 'Your professional will visit at the booked time.' },
  { key: 'COMPLETED', title: 'Service completed', text: 'Rate your experience to help others.' },
];

export default function BookingTimeline({ status }) {
  const current = normalizeStatus(status);

  if (current === 'CANCELLED') {
    return (
      <ol className="space-y-0">
        <TimelineItem title="Booking placed" state="done" last={false} />
        <TimelineItem title="Booking cancelled" text="This booking will not go ahead." state="cancelled" last />
      </ol>
    );
  }

  const currentIndex = Math.max(0, STEPS.findIndex((s) => s.key === current));
  return (
    <ol>
      {STEPS.map((step, i) => {
        const state = i < currentIndex || current === 'COMPLETED' ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        return <TimelineItem key={step.key} title={step.title} text={state === 'current' ? step.text : undefined} state={state} last={i === STEPS.length - 1} />;
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
