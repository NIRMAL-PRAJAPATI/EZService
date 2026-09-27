import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MapPin, FileText, Calendar, CheckCircle2, Clock, XCircle, BadgeCheck, MessageSquareWarning, PartyPopper, Navigation, MapPinCheck } from 'lucide-react';
import api from '../config/axios-config';
import authApi from '../config/auth-config';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import BookingTimeline from '../components/booking/BookingTimeline';
import PaymentCard from '../components/booking/PaymentCard';
import { ConfirmSheet } from '../components/ui/BottomSheet';
import OutlinedField from '../components/ui/OutlinedField';
import { StarInput } from '../components/ui/Rating';
import { Avatar } from '../components/ui/ServiceImage';
import { ErrorState, InlineError } from '../components/ui/States';
import { PageSkeleton } from '../components/ui/Skeleton';
import { normalizeStatus, orderStage } from '../components/ui/StatusBadge';
import { getAuthUser } from '../lib/auth';
import { locationText } from '../lib/geo';
import { formatDateTime, formatPrice, shortOrderId } from '../lib/format';
import { paymentLabel } from '../lib/payment';

const HERO = {
  ON_THE_WAY: { icon: Navigation, title: 'Provider is on the way', text: 'Your professional has started the trip to your location.', tone: 'bg-indigo-50 text-indigo-800', iconTone: 'bg-indigo-100 text-indigo-600' },
  ARRIVED: { icon: MapPinCheck, title: 'Provider has arrived', text: 'Your professional has reached your location.', tone: 'bg-green-50 text-green-800', iconTone: 'bg-green-100 text-green-600' },
  PENDING: { icon: Clock, title: 'Waiting for the provider', text: 'We have sent your booking. You will see it here as soon as they confirm.', tone: 'bg-amber-50 text-amber-800', iconTone: 'bg-amber-100 text-amber-600' },
  CONFIRMED: { icon: CheckCircle2, title: 'Provider confirmed', text: 'Your professional will visit at the booked time.', tone: 'bg-green-50 text-green-800', iconTone: 'bg-green-100 text-green-600' },
  COMPLETED: { icon: BadgeCheck, title: 'Service completed', text: 'Thanks for using KnockNow.', tone: 'bg-indigo-50 text-indigo-50', iconTone: 'bg-indigo-100 text-indigo-600' },
  CANCELLED: { icon: XCircle, title: 'Booking cancelled', text: 'This booking will not go ahead.', tone: 'bg-red-50 text-red-800', iconTone: 'bg-red-100 text-red-600' },
};

export default function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');
  const justBooked = location.state?.justBooked;

  const load = () => {
    setLoading(true);
    setError(false);
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  // Arrival code: shown to the customer while the provider is on the way
  const [pin, setPin] = useState(null);
  const tripStatus = order?.trip_status;
  const orderStatus = order?.status;
  useEffect(() => {
    if (tripStatus !== 'ON_THE_WAY' || String(orderStatus).toUpperCase() !== 'CONFIRMED') {
      setPin(null);
      return;
    }
    authApi
      .get(`/orders/${id}/pin`)
      .then((res) => setPin(res.data?.pin || null))
      .catch(() => setPin(null));
  }, [id, tripStatus, orderStatus]);

  // Live tracking: the server pushes trip/status changes; a light poll is the fallback.
  useEffect(() => {
    const user = getAuthUser();
    const socket = io(import.meta.env.VITE_API_BACKEND_API || 'http://localhost:3000');
    if (user?.id) socket.emit('identify', { userType: 'customer', userId: user.id });
    socket.on('orderUpdate', (u) => {
      if (u?.order_id === id) setOrder((prev) => (prev ? { ...prev, ...u } : prev));
    });
    const poll = setInterval(() => {
      api.get(`/orders/${id}`).then((res) => setOrder((prev) => (prev ? { ...prev, ...res.data } : res.data))).catch(() => { });
    }, 20000);
    return () => {
      clearInterval(poll);
      socket.disconnect();
    };
  }, [id]);

  const handleCancelOrder = () => {
    setCancelling(true);
    setActionError('');
    authApi
      .put(`/orders/${order.order_id}/status`, { status: 'CANCELLED' })
      .then(() => {
        setOrder((prev) => ({ ...prev, status: 'CANCELLED' }));
        setCancelOpen(false);
      })
      .catch((err) => {
        setActionError(err.response?.data?.message || "We couldn't cancel this booking. Please try again.");
      })
      .finally(() => setCancelling(false));
  };

  if (loading) return <PageSkeleton />;
  if (error || !order) {
    return (
      <>
        <PageHeader title="Booking" backTo="/order" />
        <ErrorState title="We couldn't load this booking" description="Please check your connection and try again." onRetry={load} />
      </>
    );
  }

  const status = normalizeStatus(order.status);
  const stage = orderStage(order);
  const hero = HERO[stage] || HERO.PENDING;
  const HeroIcon = hero.icon;
  const provider = order.ProviderInfo || {};
  const amount = order.estimated_charge || order.Service?.visiting_charge || order.Service?.instant_visiting_charge;
  // Once the provider has started the trip, the customer calls instead of cancelling.
  const canCancel = status === 'PENDING' || (status === 'CONFIRMED' && !order.trip_status);
  const inProgress = status === 'PENDING' || status === 'CONFIRMED';

  return (
    <div className="pb-10">
      <PageHeader title={`Booking #${shortOrderId(order.order_id)}`} subtitle={order.Service?.name} backTo="/order" />

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {justBooked && status !== 'CANCELLED' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-3 text-white" role="status">
            <PartyPopper className="h-5 w-5" aria-hidden="true" /> Booking placed successfully
          </motion.div>
        )}

        {/* Status hero */}
        <section className={`rounded-md p-5 ${hero.tone}`} aria-live="polite">
          <div className="flex items-center gap-3">
            <span className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center ${hero.iconTone}`}>
              <HeroIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold">{hero.title}</h2>
              <p className="text-sm opacity-90">{hero.text}</p>
            </div>
          </div>
        </section>

        {/* Arrival code */}
        {stage === 'ON_THE_WAY' && pin && (
          <section className="rounded-md border-2 border-dashed border-indigo-500 bg-white p-5 text-center" aria-labelledby="pin-title">
            <p id="pin-title" className="text-sm font-semibold text-gray-700">Your arrival code</p>
            <p className="mt-2 text-4xl font-extrabold tracking-[0.5em] text-indigo-600 pl-[0.5em]" aria-label={`Code ${pin.split('').join(' ')}`}>
              {pin}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Share this code with {provider.name || 'your provider'} only when they reach your door. They need it to start the service.
            </p>
          </section>
        )}

        {/* Payment the provider asked for at the end of the service */}
        {status === 'CONFIRMED' && stage === 'ARRIVED' && order.payment_mode && (
          <PaymentCard order={order} providerName={provider.name?.split(' ')[0] || 'your provider'} />
        )}

        {/* Timeline */}
        <section className="rounded-md border border-gray-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">Booking status</h3>
          <BookingTimeline status={stage} order={order} viewer="customer" />
        </section>

        {/* Provider */}
        <section className="rounded-md border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <Avatar name={provider.name || 'Provider'} size="h-12 w-12" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{provider.name || 'Service provider'}</p>
              <p className="text-sm text-gray-500 truncate">{order.Service?.name}</p>
            </div>
            {order.Service?.id && (
              <Link to={`/service/${order.Service.id}`} className="text-sm font-semibold text-indigo-600 px-2 py-1 rounded-sm hover:bg-indigo-50">
                Profile
              </Link>
            )}
          </div>
          {provider.mobile && inProgress && (
            <Button variant="secondary" icon={Phone} href={`tel:${provider.mobile}`} block className="mt-4">
              Call {provider.name?.split(' ')[0] || 'provider'}
            </Button>
          )}
        </section>

        {/* Details */}
        <section className="rounded-md border border-gray-200 bg-white divide-y divide-gray-100">
          <Detail icon={Calendar} label="When" value={formatDateTime(order.date)} />
          <Detail icon={MapPin} label="Location" value={locationText(order, 'customer') || '—'} />
          <Detail icon={FileText} label="Problem" value={order.issue || '—'} />
          <div className="p-4 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-600">
              {status === 'COMPLETED' && order.payment_mode ? `Paid by ${paymentLabel(order.payment_mode)}` : 'Amount (pay after service)'}
            </span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(amount)}</span>
          </div>
        </section>

        {status === 'COMPLETED' && <ReviewBox orderId={order.order_id} />}

        <InlineError>{!cancelOpen && actionError}</InlineError>

        <div className="flex flex-col gap-2 pt-1">
          {canCancel && (
            <Button variant="danger-outline" block onClick={() => setCancelOpen(true)}>
              Cancel booking
            </Button>
          )}
          <Button variant="ghost" icon={MessageSquareWarning} to={`/complaint?order=${encodeURIComponent(order.order_id)}`} block>
            Report a problem
          </Button>
        </div>
      </div>

      <ConfirmSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this booking?"
        description={`${order.Service?.name || 'This service'} with ${provider.name || 'the provider'} will be cancelled.`}
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        onConfirm={handleCancelOrder}
        loading={cancelling}
      >
        {actionError && (
          <div className="mt-3">
            <InlineError>{actionError}</InlineError>
          </div>
        )}
      </ConfirmSheet>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="p-4 flex items-start gap-3">
      <Icon className="h-5 w-5 mt-0.5 text-gray-400 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}

function ReviewBox({ orderId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    authApi
      .post('/reviews', { order_id: orderId, rating, comment })
      .then(() => setDone(true))
      .catch((err) => {
        if (err.response?.status === 409) setDone(true);
        else setError(err.response?.data?.message || "We couldn't save your review. Please try again.");
      })
      .finally(() => setSaving(false));
  };

  if (done) {
    return (
      <section className="rounded-md border border-gray-200 bg-white p-5 text-center">
        <BadgeCheck className="mx-auto h-8 w-8 text-indigo-500" aria-hidden="true" />
        <p className="mt-2 font-semibold text-gray-900">Thanks for your review</p>
        <p className="text-sm text-gray-500">It helps other customers choose.</p>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-gray-200 bg-white p-5 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900">How was your service?</h3>
        <p className="text-sm text-gray-500">Rate the professional</p>
      </div>
      <StarInput value={rating} onChange={setRating} />
      <OutlinedField as="textarea" rows={3} label="Comment (optional)" name="review-comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What went well? What could be better?" />
      <InlineError>{error}</InlineError>
      <Button type="submit" block disabled={!rating} loading={saving}>
        Submit review
      </Button>
    </form>
  );
}
