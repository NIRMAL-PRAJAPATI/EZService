import { Banknote, Landmark, QrCode } from 'lucide-react';

// How a customer can pay the provider when the service is completed
export const PAYMENT_MODES = [
  { key: 'UPI', label: 'UPI', hint: 'Customer scans your QR code', icon: QrCode },
  { key: 'CASH', label: 'Cash', hint: 'Collect cash in hand', icon: Banknote },
  { key: 'NET_BANKING', label: 'Net banking', hint: 'Customer transfers to your bank account', icon: Landmark },
];

export const paymentLabel = (mode) => PAYMENT_MODES.find((m) => m.key === mode)?.label || mode || '';

// Standard UPI payment link: every UPI app (GPay, PhonePe, Paytm, BHIM…) understands it,
// both as a QR code and as a tap-to-pay link on phones.
export const upiUrl = ({ upiId, name, amount, note }) => {
  const params = new URLSearchParams({ pa: upiId, pn: name || 'KnockNow provider', cu: 'INR' });
  if (Number(amount) > 0) params.set('am', Number(amount).toFixed(2));
  if (note) params.set('tn', note);
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`;
};
