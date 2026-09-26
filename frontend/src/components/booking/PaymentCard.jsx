import { useEffect, useState } from 'react';
import { Banknote, BadgeCheck, Landmark, Loader2, QrCode, Smartphone } from 'lucide-react';
import authApi from '../../config/auth-config';
import Button from '../ui/Button';
import CopyRow from '../ui/CopyRow';
import OutlinedField from '../ui/OutlinedField';
import { InlineError } from '../ui/States';
import { upiUrl } from '../../lib/payment';
import { formatPrice, shortOrderId } from '../../lib/format';

const ICON = { UPI: QrCode, CASH: Banknote, NET_BANKING: Landmark };

/**
 * Customer side of the payment the provider asked for at the end of the service.
 * Refetches whenever the provider changes the mode or the status changes.
 */
export default function PaymentCard({ order, providerName = 'your provider' }) {
  const [payment, setPayment] = useState(null);
  const [ref, setRef] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const mode = order.payment_mode;
  const status = order.payment_status;

  useEffect(() => {
    if (!mode) return;
    authApi
      .get(`/orders/${order.order_id}/payment`)
      .then((res) => setPayment(res.data))
      .catch(() => setPayment(null));
    setError('');
  }, [order.order_id, mode, status]);

  if (!mode) return null;
  const Icon = ICON[mode] || Banknote;
  const amount = payment?.amount;
  const paid = (payment?.status || status) === 'CUSTOMER_PAID';

  const markPaid = (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    authApi
      .put(`/orders/${order.order_id}/payment/paid`, { ref })
      .then((res) => setPayment(res.data))
      .catch((err) => setError(err.response?.data?.message || "We couldn't send your confirmation. Please try again."))
      .finally(() => setSending(false));
  };

  const title =
    mode === 'CASH' ? `Pay ${formatPrice(amount)} in cash` : mode === 'UPI' ? `Pay ${formatPrice(amount)} by UPI` : `Pay ${formatPrice(amount)} by bank transfer`;

  return (
    <section className="rounded-md border-2 border-indigo-500 bg-white p-5 space-y-4" aria-labelledby="pay-title" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="h-11 w-11 shrink-0 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 id="pay-title" className="font-bold text-gray-900">
            {payment ? title : 'Payment'}
          </h3>
          <p className="text-sm text-gray-500">{providerName} has finished the service</p>
        </div>
      </div>

      {!payment && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading payment details…
        </div>
      )}

      {payment && mode === 'CASH' && <p className="text-sm text-gray-700">Hand over the cash to {providerName}. They will close the booking once they receive it.</p>}

      {payment && paid && mode !== 'CASH' && (
        <div className="rounded-md bg-green-50 p-4 text-center" role="status">
          <BadgeCheck className="mx-auto h-8 w-8 text-green-600" aria-hidden="true" />
          <p className="mt-1 font-semibold text-green-800">Payment sent</p>
          <p className="text-sm text-green-800">Waiting for {providerName} to confirm they received it.</p>
          {payment.ref && <p className="mt-1 text-xs text-green-700">Reference: {payment.ref}</p>}
        </div>
      )}

      {payment && !paid && mode === 'UPI' && payment.payee?.upi_id && (
        <>
          <p className="text-sm text-gray-700">
            Scan the QR code on {providerName}'s phone with any UPI app, or pay from this phone:
          </p>
          <Button
            block
            icon={Smartphone}
            href={upiUrl({ upiId: payment.payee.upi_id, name: payment.payee.name, amount, note: `EZService #${shortOrderId(order.order_id)}` })}
          >
            Pay with UPI app
          </Button>
          <div className="rounded-md border border-gray-200 px-3">
            <CopyRow label={`UPI ID of ${payment.payee.name}`} value={payment.payee.upi_id} />
          </div>
        </>
      )}

      {payment && !paid && mode === 'NET_BANKING' && payment.payee && (
        <>
          <ol className="space-y-1.5 text-sm text-gray-700 list-decimal pl-5">
            <li>Open your bank's app or net banking.</li>
            <li>Add the account below as a payee.</li>
            <li>Send exactly {formatPrice(amount)} by IMPS (it reaches instantly).</li>
            <li>Enter the transaction reference (UTR) below.</li>
          </ol>
          <div className="rounded-md border border-gray-200 px-3 divide-y divide-gray-100">
            <CopyRow label="Account holder" value={payment.payee.name} />
            <CopyRow label="Account number" value={payment.payee.account_number} mono />
            <CopyRow label="IFSC" value={payment.payee.ifsc_code} mono />
            <CopyRow label="Bank" value={[payment.payee.bank_name, payment.payee.branch].filter(Boolean).join(', ')} />
          </div>
        </>
      )}

      {payment && !paid && mode !== 'CASH' && (
        <form onSubmit={markPaid} className="space-y-3 pt-1">
          <OutlinedField
            label={mode === 'NET_BANKING' ? 'Transaction reference (UTR)' : 'UPI reference number (optional)'}
            name="payment-ref"
            value={ref}
            onChange={(e) => setRef(e.target.value.replace(/\s/g, '').slice(0, 64))}
            placeholder={mode === 'NET_BANKING' ? 'From your bank app, e.g. 412345678901' : '12-digit UPI ref, if you have it'}
            hint="You'll find it in your payment app after paying."
            autoComplete="off"
          />
          <InlineError>{error}</InlineError>
          <Button type="submit" block variant="success" loading={sending} disabled={mode === 'NET_BANKING' && ref.length < 6}>
            I've paid {formatPrice(amount)}
          </Button>
        </form>
      )}
    </section>
  );
}
