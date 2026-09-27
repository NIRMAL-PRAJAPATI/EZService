import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ChevronsRight, Loader2 } from 'lucide-react';

const HANDLE = 52;
const PAD = 4;

/**
 * "Slide to …" control for actions that shouldn't happen by an accidental tap.
 * Keyboard users can press Enter or Space on the handle instead of dragging.
 */
export default function SlideToConfirm({ label, onConfirm, loading = false, disabled = false }) {
  const trackRef = useRef(null);
  const [max, setMax] = useState(0);
  const x = useMotionValue(0);
  const fillWidth = useTransform(x, (v) => v + HANDLE + PAD * 2);
  const textOpacity = useTransform(x, [0, Math.max(1, max * 0.6)], [1, 0]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    const measure = () => setMax(Math.max(0, el.clientWidth - HANDLE - PAD * 2));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Slide back if the action finished without leaving this screen (e.g. it failed)
  useEffect(() => {
    if (!loading) animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 });
  }, [loading, x]);

  const confirm = () => {
    if (disabled || loading) return;
    animate(x, max, { duration: 0.15 });
    onConfirm?.();
  };

  const onDragEnd = () => {
    if (x.get() >= max * 0.85) confirm();
    else animate(x, 0, { type: 'spring', stiffness: 400, damping: 35 });
  };

  return (
    <div
      ref={trackRef}
      className={`relative h-[60px] w-full select-none overflow-hidden rounded-full ${disabled ? 'bg-gray-200' : 'bg-green-100'}`}
    >
      <motion.div className="absolute inset-y-0 left-0 rounded-full bg-green-600" style={{ width: fillWidth }} aria-hidden="true" />
      <motion.span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center pl-12 text-sm font-semibold ${disabled ? 'text-gray-500' : 'text-green-800'}`}
        style={{ opacity: textOpacity }}
        aria-hidden="true"
      >
        {label}
      </motion.span>
      <motion.button
        type="button"
        drag={disabled || loading ? false : 'x'}
        dragConstraints={{ left: 0, right: max }}
        dragElastic={0}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            confirm();
          }
        }}
        style={{ x, width: HANDLE, height: HANDLE, top: PAD, left: PAD }}
        className={`absolute flex items-center justify-center rounded-full bg-white shadow-md touch-none ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-green-700 cursor-grab active:cursor-grabbing'}`}
        aria-label={`${label}. Drag right, or press Enter`}
        aria-disabled={disabled || loading}
      >
        {loading ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" /> : <ChevronsRight className="h-6 w-6" aria-hidden="true" />}
      </motion.button>
    </div>
  );
}
