import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, MapPin, Clock, UserRound, Send, Radio } from 'lucide-react';
import { io } from 'socket.io-client';
import authApi from '../config/auth-config';
import { ProviderPage } from '../components/layout/ProviderLayout';
import InstantStatusToggle from '../components/provider/InstantStatusToggle';
import { useAvailability } from '../components/provider/AvailabilityContext';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import { EmptyState, InlineError } from '../components/ui/States';
import { formatPrice } from '../lib/format';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND_API || 'http://localhost:3000';
const ETAS = ['5-10 minutes', '15-20 minutes', '30-45 minutes', '1 hour'];

// Requests arrive either from the REST API (DB rows) or live over the socket
// (the payload the customer emitted). Normalise both into one shape.
const normalizeRequest = (r) => ({
  id: r.id ?? r.requestId,
  categoryId: String(r.service_type_id ?? (typeof r.serviceType === 'object' ? r.serviceType?.id : r.serviceType) ?? ''),
  categoryName: (typeof r.serviceType === 'object' ? r.serviceType?.name : null) || r.categoryName || '',
  customerName: r.CustomerInfo?.name || r.customerName || 'Customer',
  address: r.address,
  description: r.description,
  created: r.created || new Date().toISOString(),
});

const ProviderInstantRequests = () => {
  const availability = useAvailability();
  const [requests, setRequests] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [providerInfo, setProviderInfo] = useState(null);
  const [rating, setRating] = useState(null);
  const [selected, setSelected] = useState(null);
  const [offerData, setOfferData] = useState({ price: '', estimatedArrival: '15-20 minutes' });
  const [defaultPrice, setDefaultPrice] = useState('');
  const [offerAttempts, setOfferAttempts] = useState({});
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const socket = useRef(null);
  const toastTimer = useRef(null);

  const notify = (message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4000);
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
  };

  useEffect(() => {
    socket.current = io(SOCKET_URL);

    authApi
      .get('/provider/profile')
      .then((res) => {
        setProviderInfo(res.data);
        if (res.data?.id && socket.current) {
          socket.current.emit('identify', { userType: 'provider', userId: res.data.id });
        }
      })
      .catch(() => {});

    authApi
      .get('/provider/stats')
      .then((res) => setRating(Number(res.data?.averageRating) > 0 ? Number(res.data.averageRating) : null))
      .catch(() => {});

    // Only join service-category rooms (and so receive instant requests) when
    // the provider is online. Rooms are keyed by service CATEGORY id.
    Promise.all([
      authApi.get('/provider/online-status').catch(() => ({ data: { isOnline: false } })),
      authApi.get('/provider/services').catch(() => ({ data: [] })),
    ]).then(([statusResponse, servicesResponse]) => {
      const services = servicesResponse.data || [];
      setMyServices(services);
      const categoryIds = [...new Set(services.map((s) => s.category_id).filter((id) => id != null))];
      if (statusResponse.data?.isOnline && categoryIds.length && socket.current) {
        socket.current.emit('providerJoin', categoryIds);
      }
    });

    authApi
      .get('/service-requests/active')
      .then((res) => setRequests((Array.isArray(res.data) ? res.data : []).map(normalizeRequest)))
      .catch(() => {});

    socket.current.on('newServiceRequest', (requestData) => {
      const req = normalizeRequest(requestData);
      setRequests((prev) => [req, ...prev.filter((r) => r.id !== req.id)]);
      notify('New service request received');
    });

    socket.current.on('offerAccepted', (data) => {
      setRequests((prev) => prev.filter((r) => r.id !== data.requestId));
      notify('Your offer was accepted! Check your orders.');
    });

    socket.current.on('offerDeclined', (data) => {
      setOfferAttempts((prev) => {
        if (!data.requestId || !data.serviceId) return prev;
        const key = `${data.requestId}_${data.serviceId}`;
        const attempts = (prev[key] || 0) + 1;
        notify(attempts < 3 ? `Offer declined. You can send ${3 - attempts} more.` : 'Offer declined. No more offers allowed for this request.');
        return { ...prev, [key]: attempts };
      });
    });

    return () => {
      clearTimeout(toastTimer.current);
      if (socket.current) {
        socket.current.off('newServiceRequest');
        socket.current.off('offerAccepted');
        socket.current.off('offerDeclined');
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  // The provider's own service listing for a request's category (used for the
  // default price and as the service_id on the resulting order).
  const serviceFor = (req) => myServices.find((s) => String(s.category_id) === String(req.categoryId));

  const visible = useMemo(() => requests.filter((r) => r.id && !skipped.includes(r.id)), [requests, skipped]);

  const attemptsFor = (req) => {
    const svc = serviceFor(req);
    return offerAttempts[`${req.id}_${svc?.id ?? req.categoryId}`] || 0;
  };

  const openOffer = (req) => {
    const svc = serviceFor(req);
    const price = svc?.instant_visiting_charge ?? svc?.visiting_charge ?? '';
    setDefaultPrice(String(price));
    setOfferData({ price: String(price), estimatedArrival: '15-20 minutes' });
    setError('');
    setSelected(req);
  };

  const adjust = (delta) => setOfferData((p) => ({ ...p, price: String(Math.max(0, (parseInt(p.price, 10) || 0) + delta)) }));

  const handleSubmitOffer = (e) => {
    e.preventDefault();
    setError('');
    if (!offerData.price || Number(offerData.price) <= 0) return setError('Please enter your visiting charge.');

    const svc = serviceFor(selected);
    const serviceId = svc?.id ?? selected.categoryId;
    const offer = {
      id: Math.random().toString(36).substring(7),
      requestId: selected.id,
      provider: { id: providerInfo?.id, name: providerInfo?.name, rating },
      service: { id: serviceId, name: svc?.name || selected.categoryName || 'Instant service' },
      price: parseFloat(offerData.price),
      estimatedArrival: offerData.estimatedArrival,
    };

    setOfferAttempts((prev) => {
      const key = `${selected.id}_${serviceId}`;
      return { ...prev, [key]: (prev[key] || 0) + 1 };
    });

    socket.current?.emit('serviceOffer', { requestId: selected.id, offer });
    setSelected(null);
    notify('Offer sent to the customer');
  };

  const online = availability?.isOnline;

  return (
    <ProviderPage title="Instant requests" subtitle="Live requests from customers who need help now.">
      <InstantStatusToggle />

      <div aria-live="polite" className="sr-only">
        {toast}
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-1/2 top-16 z-50 -translate-x-1/2 rounded-sm bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mt-6" aria-labelledby="requests-title">
        <h2 id="requests-title" className="text-lg font-bold tracking-wide text-gray-900 mb-3 flex items-center gap-2">
          Incoming requests
          {online && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
              <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" /> Listening
            </span>
          )}
        </h2>

        {visible.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <EmptyState
              icon={Zap}
              title={online ? 'Waiting for requests' : "You're offline"}
              description={online ? 'New requests for your services will pop up here automatically.' : 'Go online to start receiving instant service requests.'}
            />
          </div>
        ) : (
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <AnimatePresence initial={false}>
              {visible.map((req) => {
                const attempts = attemptsFor(req);
                const svc = serviceFor(req);
                const maxed = attempts >= 3;
                return (
                  <motion.li
                    key={req.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-md border-2 border-indigo-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                        <Zap className="h-4 w-4" aria-hidden="true" /> New service request
                      </span>
                      <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        {new Date(req.created).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">{req.categoryName || svc?.category?.name || svc?.name || 'Service request'}</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" /> {req.customerName}
                      </li>
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" aria-hidden="true" /> {req.address}
                      </li>
                    </ul>
                    <div className="mt-3 rounded-sm bg-gray-50 px-3 py-2">
                      <p className="text-xs font-medium text-gray-500">Issue</p>
                      <p className="text-sm text-gray-900">{req.description}</p>
                    </div>
                    {svc && (
                      <p className="mt-3 text-sm text-gray-600">
                        Your instant charge: <span className="font-semibold text-gray-900">{formatPrice(svc.instant_visiting_charge ?? svc.visiting_charge)}</span>
                      </p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button variant="secondary" className="flex-1" onClick={() => setSkipped((s) => [...s, req.id])}>
                        Skip
                      </Button>
                      <Button className="flex-[2]" icon={Send} onClick={() => openOffer(req)} disabled={maxed}>
                        {maxed ? 'No offers left' : attempts > 0 ? `Send new offer (${3 - attempts} left)` : 'Send offer'}
                      </Button>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <BottomSheet
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Send your offer"
        footer={
          <Button type="submit" form="offer-form" block icon={Send}>
            Send offer · {formatPrice(offerData.price)}
          </Button>
        }
      >
        {selected && (
          <form id="offer-form" onSubmit={handleSubmitOffer} className="space-y-5">
            <div className="rounded-sm bg-gray-50 p-3 text-sm">
              <p className="font-semibold text-gray-900">
                {selected.categoryName || 'Service request'} · {selected.customerName}
              </p>
              <p className="text-gray-600">{selected.address}</p>
              <p className="text-gray-600 mt-1">“{selected.description}”</p>
            </div>

            <div>
              <label htmlFor="offer-price" className="text-sm font-semibold text-gray-900">
                Your visiting charge
              </label>
              <div className="mt-2 flex items-center rounded-sm border border-gray-300 focus-within:border-indigo-500">
                <span className="pl-4 text-xl font-bold text-gray-500">₹</span>
                <input
                  id="offer-price"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={offerData.price}
                  onChange={(e) => setOfferData((p) => ({ ...p, price: e.target.value }))}
                  className="h-14 w-full rounded-sm bg-transparent px-2 text-2xl font-extrabold tracking-wide text-gray-900 outline-none"
                />
              </div>
              <div className="mt-2 grid grid-cols-5 gap-1.5 text-sm font-semibold">
                <button type="button" onClick={() => adjust(-100)} className="h-10 rounded-sm border border-gray-200 bg-white text-gray-700">−100</button>
                <button type="button" onClick={() => adjust(-50)} className="h-10 rounded-sm border border-gray-200 bg-white text-gray-700">−50</button>
                <button type="button" onClick={() => setOfferData((p) => ({ ...p, price: defaultPrice }))} disabled={!defaultPrice} className="h-10 rounded-sm border border-indigo-200 bg-indigo-50 text-indigo-700 disabled:opacity-50">Default</button>
                <button type="button" onClick={() => adjust(50)} className="h-10 rounded-sm border border-gray-200 bg-white text-gray-700">+50</button>
                <button type="button" onClick={() => adjust(100)} className="h-10 rounded-sm border border-gray-200 bg-white text-gray-700">+100</button>
              </div>
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-gray-900 mb-2">You can reach them in</legend>
              <div className="grid grid-cols-2 gap-2">
                {ETAS.map((eta) => (
                  <button
                    key={eta}
                    type="button"
                    aria-pressed={offerData.estimatedArrival === eta}
                    onClick={() => setOfferData((p) => ({ ...p, estimatedArrival: eta }))}
                    className={`h-11 rounded-sm border text-sm font-medium ${offerData.estimatedArrival === eta ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700'}`}
                  >
                    {eta}
                  </button>
                ))}
              </div>
            </fieldset>
            <InlineError>{error}</InlineError>
          </form>
        )}
      </BottomSheet>
    </ProviderPage>
  );
};

export default ProviderInstantRequests;
