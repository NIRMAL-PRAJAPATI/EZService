import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatPrice } from '../../lib/format';
import { paymentLabel } from '../../lib/payment';

// Fired by the trip controls when a trip ends with a payment: { amount, mode }
export const TRIP_DONE_EVENT = 'ez:trip-done';
export const showTripDone = (detail) => window.dispatchEvent(new CustomEvent(TRIP_DONE_EVENT, { detail }));

const SHOW_MS = 1300;

/**
 * Short full-screen "Payment successful · Trip ended" animation.
 * Lives in the provider layout so it keeps playing while the trip card behind it updates.
 * It never takes clicks or scrolling, so it can't leave the page stuck.
 */
export default function TripDoneOverlay() {
  const [done, setDone] = useState(null);

  useEffect(() => {
    let timer;
    const onDone = (e) => {
      clearTimeout(timer);
      setDone(e.detail || {});
      timer = setTimeout(() => setDone(null), SHOW_MS);
    };
    window.addEventListener(TRIP_DONE_EVENT, onDone);
    return () => {
      window.removeEventListener(TRIP_DONE_EVENT, onDone);
      clearTimeout(timer);
    };
  }, []);

  return createPortal(
    <AnimatePresence>
      {done && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[70] flex flex-col items-center justify-center bg-green-600 px-6 text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="status"
          aria-live="assertive"
        >
          <motion.div
            className="flex h-28 w-28 items-center justify-center rounded-full bg-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
          >
            <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
              <motion.path
                d="M14 27 L23 36 L39 18"
                fill="none"
                stroke="#16a34a"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2, duration: 0.35, ease: 'easeOut' }}
              />
            </svg>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.25 }}>
            <p className="mt-6 text-2xl font-extrabold">Payment successful</p>
            {done.amount ? (
              <p className="mt-1 text-lg font-semibold text-green-50">
                {formatPrice(done.amount)}
                {done.mode ? ` · ${paymentLabel(done.mode)}` : ''}
              </p>
            ) : null}
            <p className="mt-3 text-sm font-medium text-green-100">Trip ended</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
