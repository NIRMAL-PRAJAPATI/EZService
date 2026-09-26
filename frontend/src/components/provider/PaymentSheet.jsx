import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { ArrowLeft, BadgeCheck, ChevronRight, Loader2 } from 'lucide-react';
import authApi from '../../config/auth-config';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import CopyRow from '../ui/CopyRow';
import SlideToConfirm from '../ui/SlideToConfirm';
import { InlineError } from '../ui/States';
import { PAYMENT_MODES, paymentLabel, upiUrl } from '../../lib/payment';
import { formatPrice, shortOrderId } from '../../lib/format';

const POLL_MS = 4000;

/**
 * Last step of a trip: the provider picks how the customer pays.
 *  - UPI: show a QR code; when the customer confirms the payment, slide to end the trip.
 *  - Cash: collect it and end the trip.
 *  - Net banking: show the bank account the customer transfers to (IMPS/NEFT);
 *    the customer enters the transaction reference, the provider checks it and ends the trip.
 */
export default function PaymentSheet({ open, onClose, order, onComplete, completing, completeError }) {
  const [mode, setMode] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [missingPayee, setMissingPayee] = useState(false);
  const [manual, setManual] = useState(false);
  const [qrSvg, setQrSvg] = useState('');
  const customerName = order.CustomerInfo?.name || 'the customer';
  const amount = payment?.amount || order.estimated_charge || order.Service?.visiting_charge;

  // Start fresh each time the sheet opens (keeping a mode already chosen for this order)
  useEffect(() => {
    if (!open) return;
    setError('');
    setMissingPayee(false);
    setManual(false);
    setPayment(null);
    setMode(null);
    if (order.payment_mode) choose(order.payment_mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const choose = (key) => {
    setMode(key);
    setError('');
    setMissingPayee(false);
    setManual(false);
    setLoading(true);
    authApi
      .put(`/orders/${order.order_id}/payment`, { mode: key })
      .then((res) => setPayment(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Couldn't start the payment. Please try again.");
        setMissingPayee(err.response?.data?.code === 'PAYEE_MISSING');
      })
      .finally(() => setLoading(false));
  };

  // Wait for the customer's "I've paid" (live update from the order list, polling as a fallback)
  const waiting = open && payment && payment.mode !== 'CASH' && payment.status === 'PENDING';
  const pollRef = useRef(null);
  useEffect(() => {
    if (!waiting) return undefined;
    pollRef.current = setInterval(() => {
      authApi
        .get(`/orders/${order.order_id}/payment`)
        .then((res) => setPayment((prev) => (prev && res.data?.mode === prev.mode ? res.data : prev)))
        .catch(() => {});
    }, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [waiting, order.order_id]);
  useEffect(() => {
    if (order.payment_status === 'CUSTOMER_PAID' && payment?.mode === order.payment_mode && payment.status !== 'CUSTOMER_PAID') {
      setPayment((prev) => ({ ...prev, status: 'CUSTOMER_PAID', ref: order.payment_ref || prev.ref }));
    }
  }, [order.payment_status, order.payment_mode, order.payment_ref, payment]);

  // UPI QR code
  const upiLink =
    payment?.mode === 'UPI' && payment.payee?.upi_id
      ? upiUrl({ upiId: payment.payee.upi_id, name: payment.payee.name, amount: payment.amount, note: `EZService #${shortOrderId(order.order_id)}` })
      : '';
  useEffect(() => {
    if (!upiLink) return setQrSvg('');
    let alive = true;
    QRCode.toString(upiLink, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#111827', light: '#ffffff' } })
      .then((svg) => alive && setQrSvg(svg))
      .catch(() => alive && setQrSvg(''));
    return () => {
      alive = false;
    };
  }, [upiLink]);

  const paid = payment?.status === 'CUSTOMER_PAID';
  const end = () => onComplete(mode);
  const back = () => {
    setMode(null);
    setPayment(null);
    setError('');
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={mode ? `${paymentLabel(mode)} payment` : 'How is the customer paying?'} size="sm" dismissible={!completing}>
      <div className="space-y-4 pt-1">
        <div className="rounded-md bg-gray-50 px-4 py-3 text-center">
          <p className="text-xs font-medium text-gray-500">Amount to collect</p>
          <p className="text-3xl font-extrabold text-gray-900">{formatPrice(amount)}</p>
          <p className="text-xs text-gray-500">from {customerName}</p>
        </div>

        {!mode && (
          <ul className="space-y-2" aria-label="Payment mode">
            {PAYMENT_MODES.map(({ key, label, hint, icon: Icon }) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => choose(key)}
                  className="w-full flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 text-left hover:border-indigo-400 hover:bg-indigo-50/40"
                >
                  <span className="h-10 w-10 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-gray-900">{label}</span>
                    <span className="block text-sm text-gray-500">{hint}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {mode && (
          <button type="button" onClick={back} disabled={completing} className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Change payment mode
          </button>
        )}

        {mode && loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Preparing…
          </div>
        )}

        {mode && error && (
          <div className="space-y-2">
            <InlineError>{error}</InlineError>
            {missingPayee && (
              <Link to="/provider/profile" onClick={onClose} className="inline-block text-sm font-semibold text-indigo-600 underline">
                Open bank details
              </Link>
            )}
          </div>
        )}

        {/* Cash: nothing to wait for */}
        {mode === 'CASH' && payment && (
          <>
            <p className="text-sm text-gray-600">Collect {formatPrice(amount)} in cash from {customerName}, then end the trip.</p>
            <Button block size="lg" variant="success" icon={BadgeCheck} onClick={end} loading={completing}>
              Cash received, end trip
            </Button>
          </>
        )}

        {/* UPI: QR code */}
        {mode === 'UPI' && payment && (
          <>
            {!paid && (
              <div className="text-center">
                <div className="mx-auto w-56 rounded-md border border-gray-200 bg-white p-2">
                  {qrSvg ? (
                    <div className="[&>svg]:h-auto [&>svg]:w-full" role="img" aria-label={`UPI QR code for ${formatPrice(payment.amount)}`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
                  ) : (
                    <div className="aspect-square flex items-center justify-center text-gray-400">
                      <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm text-gray-600">Ask {customerName} to scan this with any UPI app (GPay, PhonePe, Paytm, BHIM).</p>
                <div className="mt-2 rounded-md border border-gray-200 px-3 text-left">
                  <CopyRow label={`Paying ${payment.payee?.name || ''}`} value={payment.payee?.upi_id} />
                </div>
              </div>
            )}
            <PaymentWait paid={paid} payment={payment} customerName={customerName} manual={manual} setManual={setManual} onEnd={end} completing={completing} />
          </>
        )}

        {/* Net banking: bank transfer (IMPS / NEFT) */}
        {mode === 'NET_BANKING' && payment && (
          <>
            {!paid && (
              <>
                <ol className="space-y-1.5 text-sm text-gray-700 list-decimal pl-5">
                  <li>{customerName} opens their bank app or net banking.</li>
                  <li>They add the account below as a payee and send {formatPrice(payment.amount)} by IMPS (instant).</li>
                  <li>They enter the transaction reference (UTR) in their EZService booking.</li>
                  <li>You check the credit in your bank app and end the trip.</li>
                </ol>
                <div className="rounded-md border border-gray-200 px-3 divide-y divide-gray-100">
                  <CopyRow label="Account holder" value={payment.payee?.name} />
                  <CopyRow label="Account number" value={payment.payee?.account_number} mono />
                  <CopyRow label="IFSC" value={payment.payee?.ifsc_code} mono />
                  <CopyRow label="Bank" value={[payment.payee?.bank_name, payment.payee?.branch].filter(Boolean).join(', ')} />
                </div>
                <p className="text-xs text-gray-500">The customer also sees these details in their booking.</p>
              </>
            )}
            <PaymentWait paid={paid} payment={payment} customerName={customerName} manual={manual} setManual={setManual} onEnd={end} completing={completing} />
          </>
        )}

        {completeError && <InlineError>{completeError}</InlineError>}
      </div>
    </BottomSheet>
  );
}

// Waiting for the customer's confirmation, then "slide to end trip"
function PaymentWait({ paid, payment, customerName, manual, setManual, onEnd, completing }) {
  if (paid) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-green-50 p-4 text-center" role="status">
          <BadgeCheck className="mx-auto h-10 w-10 text-green-600" aria-hidden="true" />
          <p className="mt-1 font-semibold text-green-800">
            {customerName} has paid {formatPrice(payment.amount)}
          </p>
          {payment.ref && (
            <p className="mt-1 text-sm text-green-800">
              Reference: <span className="font-mono font-semibold">{payment.ref}</span>
            </p>
          )}
          <p className="mt-1 text-xs text-green-700">Check that the money reached your {payment.mode === 'UPI' ? 'UPI app' : 'bank account'}.</p>
        </div>
        <SlideToConfirm label="Slide to end trip" onConfirm={onEnd} loading={completing} />
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 rounded-md bg-amber-50 px-3 py-3 text-sm font-medium text-amber-800" role="status">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Waiting for {customerName} to pay…
      </div>
      {manual ? (
        <SlideToConfirm label="Slide to end trip" onConfirm={onEnd} loading={completing} />
      ) : (
        <button type="button" onClick={() => setManual(true)} className="w-full text-center text-sm font-semibold text-gray-600 underline">
          Money already in your account? End trip anyway
        </button>
      )}
    </div>
  );
}
