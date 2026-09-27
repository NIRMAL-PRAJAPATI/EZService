import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { lockScroll } from '../../lib/scrollLock';

/**
 * Bottom sheet on phones, centred dialog from `sm` upwards.
 * Closes on backdrop tap and Escape; locks page scroll while open.
 */
export default function BottomSheet({ open, onClose, title, children, footer, size = 'md', dismissible = true }) {
  const panelRef = useRef(null);
  // Keep the latest close handler in a ref. Callers usually pass an inline
  // function, and depending on it directly would re-run the effect below on
  // every keystroke and pull focus out of the textbox being typed in.
  const onCloseRef = useRef(onClose);
  const dismissibleRef = useRef(dismissible);
  onCloseRef.current = onClose;
  dismissibleRef.current = dismissible;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissibleRef.current) onCloseRef.current?.();
    };
    document.addEventListener('keydown', onKey);
    const unlockScroll = lockScroll();
    // Move focus into the sheet once, when it opens (not if a field already has focus).
    const t = setTimeout(() => {
      if (panelRef.current && !panelRef.current.contains(document.activeElement)) panelRef.current.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
      clearTimeout(t);
    };
  }, [open]);

  const width = size === 'lg' ? 'sm:max-w-2xl' : size === 'sm' ? 'sm:max-w-sm' : 'sm:max-w-lg';

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={dismissible ? onClose : undefined}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
            tabIndex={-1}
            className={`relative w-full ${width} max-h-[90vh] flex flex-col bg-white rounded-t-lg sm:rounded-md shadow-xl outline-none`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
          >
            <div className="sm:hidden mx-auto mt-2.5 h-1.5 w-10 rounded-full bg-gray-300" aria-hidden="true" />
            {(title || dismissible) && (
              <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-2">
                <h2 className="text-lg font-bold tracking-wide text-gray-900">{title}</h2>
                {dismissible && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-9 w-9 -mr-2 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            <div className="px-5 pb-5 min-h-0 overflow-y-auto">{children}</div>
            {footer && <div className="px-5 py-4 border-t border-gray-100 bottom-safe">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ConfirmSheet({ open, onClose, title, description, confirmLabel = 'Confirm', cancelLabel = 'Go back', onConfirm, loading, variant = 'danger', children }) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title} size="sm">
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {children}
      <div className="mt-5 flex flex-col-reverse sm:flex-row gap-2">
        <button type="button" onClick={onClose} className="h-11 flex-1 rounded-sm border border-gray-300 font-semibold text-gray-800 hover:bg-gray-50">
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`h-11 flex-1 rounded-sm font-semibold text-white disabled:opacity-60 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          {loading ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </BottomSheet>
  );
}
