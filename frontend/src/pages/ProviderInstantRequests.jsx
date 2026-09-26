import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap, MapPin, Clock, UserRound, Send, Radio, Settings2, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { distanceKm, formatKm, locationText, directionsUrl } from '../lib/geo';
import Switch from '../components/ui/Switch';
import { SERVICES_CHANGED } from '../components/provider/GoOnlineSheet';
import { getCategoryIcon } from '../lib/categories';
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
// A provider can send up to 3 offers for one customer request. A new request
// (even from the same customer) has a new id, so it starts again at 3.
const MAX_OFFERS = 3;

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
  lat: r.lat != null ? Number(r.lat) : null,
  lng: r.lng != null ? Number(r.lng) : null,
});

// A service takes instant requests when it is active and switched on for Instant
const isInstant = (s) => s.is_active !== false && s.instant_enabled !== false;

const ProviderInstantRequests = () => {
  const availability = useAvailability();
  const [requests, setRequests] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [providerInfo, setProviderInfo] = useState(null);
  const [rating, setRating] = useState(null);
  const [selected, setSelected] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [offerData, setOfferData] = useState({ price: '', estimatedArrival: '15-20 minutes' });
  const [defaultPrice, setDefaultPrice] = useState('');
  const [offerAttempts, setOfferAttempts] = useState({});
  const offerAttemptsRef = useRef({});
  offerAttemptsRef.current = offerAttempts;
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
      // Only categories of active services switched on for Instant Service
      const categoryIds = [...new Set(services.filter(isInstant).map((s) => s.category_id).filter((id) => id != null))];
      if (statusResponse.data?.isOnline && categoryIds.length && socket.current) {
        socket.current.emit('providerJoin', categoryIds);
      }
    });

    // Keep the service list in sync with changes made in "Verify your services"
    const refreshServices = () => authApi.get('/provider/services').then((res) => setMyServices(res.data || [])).catch(() => {});
    window.addEventListener(SERVICES_CHANGED, refreshServices);

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

    // A decline doesn't use up an offer: only sending one does (counted in handleSubmitOffer)
    socket.current.on('offerDeclined', (data) => {
      if (!data?.requestId || !data?.serviceId) return notify('Offer declined.');
      const sent = offerAttemptsRef.current[`${data.requestId}_${data.serviceId}`] || 0;
      const left = Math.max(0, MAX_OFFERS - sent);
      notify(left > 0 ? `Offer declined. You can send ${left} more.` : 'Offer declined. No more offers allowed for this request.');
    });

    return () => {
      clearTimeout(toastTimer.current);
      window.removeEventListener(SERVICES_CHANGED, refreshServices);
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
  const serviceFor = (req) => {
    const inCategory = myServices.filter((s) => String(s.category_id) === String(req.categoryId));
    return inCategory.find(isInstant) || inCategory[0];
  };

  // Instant Service settings: which services take live requests
  const toggleInstant = (svc, value) => {
    setSettingsError('');
    setMyServices((list) => list.map((s) => (s.id === svc.id ? { ...s, instant_enabled: value } : s)));
    authApi.patch(`/services/${svc.id}/flags`, { instant_enabled: value }).catch(() => {
      setMyServices((list) => list.map((s) => (s.id === svc.id ? { ...s, instant_enabled: !value } : s)));
      setSettingsError("Couldn't save. Please try again.");
    });
  };
  const instantCount = myServices.filter(isInstant).length;

  const visible = useMemo(() => requests.filter((r) => r.id && !skipped.includes(r.id)), [requests, skipped]);

  // One job at a time: no new offers while a trip is running
  const [runningTrip, setRunningTrip] = useState(null);
  useEffect(() => {
    const check = () =>
      authApi
        .get('/orders/provider?all=true')
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : [];
          setRunningTrip(list.find((o) => String(o.status).toUpperCase() === 'CONFIRMED' && (o.trip_status === 'ON_THE_WAY' || o.trip_status === 'ARRIVED')) || null);
        })
        .catch(() => {});
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);

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
      distanceKm: distanceKm(myPos, selected),
    };

    const key = `${selected.id}_${serviceId}`;
    if ((offerAttemptsRef.current[key] || 0) >= MAX_OFFERS) {
      setSelected(null);
      return notify('No more offers allowed for this request.');
    }
    setOfferAttempts((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

    socket.current?.emit('serviceOffer', { requestId: selected.id, offer });
    setSelected(null);
    notify('Offer sent to the customer');
  };

  const online = availability?.isOnline;
  const myPos = availability?.position;

  return (
    <ProviderPage title="Instant requests" subtitle="Live requests from customers who need help now.">
      <InstantStatusToggle />

      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="mt-3 flex w-full items-center gap-3 rounded-md border border-gray-200 bg-white p-4 text-left hover:border-indigo-300"
      >
        <span className="h-10 w-10 shrink-0 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Settings2 className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-gray-900">Service settings</span>
          <span className="block text-sm text-gray-500">
            {instantCount} of {myServices.length} service{myServices.length === 1 ? '' : 's'} on for Instant Service
          </span>
        </span>
      </button>

      <BottomSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Instant Service settings">
        <p className="text-sm text-gray-500 mb-3">Switch on the services you want live requests for when you go online.</p>
        {myServices.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500">You haven't added any services yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-sm border border-gray-200">
            {myServices.map((svc) => {
              const Icon = getCategoryIcon(svc.category?.name || svc.name);
              const inactive = svc.is_active === false;
              return (
                <li key={svc.id} className="flex items-center gap-3 p-3">
                  <Icon className="h-5 w-5 shrink-0 text-indigo-500" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">{svc.name}</p>
                    <p className="text-xs text-gray-500">
                      {inactive ? 'Hidden service. Turn it on in My services first.' : `${svc.category?.name || ''} · instant ${formatPrice(svc.instant_visiting_charge ?? svc.visiting_charge)}`}
                    </p>
                  </div>
                  <Switch checked={!inactive && svc.instant_enabled !== false} disabled={inactive} onChange={(v) => toggleInstant(svc, v)} label={`${svc.name} in Instant Service`} />
                </li>
              );
            })}
          </ul>
        )}
        {settingsError && <p className="mt-3 text-sm text-red-600" role="alert">{settingsError}</p>}
        <p className="mt-3 text-xs text-gray-400">Changes apply straight away, even while you're online.</p>
      </BottomSheet>

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

      {runningTrip && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4" role="status">
          <Navigation className="h-5 w-5 mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800">You have a running trip</p>
            <p className="text-sm text-amber-800">
              Finish {runningTrip.Service?.name || 'your current job'} for {runningTrip.CustomerInfo?.name || 'the customer'} before taking a new request.
            </p>
          </div>
          <Link to="/provider/trips" className="text-sm font-semibold text-amber-800 underline">
            Open
          </Link>
        </div>
      )}

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
                const maxed = attempts >= MAX_OFFERS;
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
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{req.categoryName || svc?.category?.name || svc?.name || 'Service request'}</h3>
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-sm bg-indigo-50 px-2 py-1 text-sm font-bold text-indigo-700" title="Straight-line distance from your live location">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        {formatKm(distanceKm(myPos, req)) ? `${formatKm(distanceKm(myPos, req))} away` : req.lat == null ? 'No location' : 'Locating…'}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-gray-400 shrink-0" aria-hidden="true" /> {req.customerName}
                      </li>
                      <li className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" aria-hidden="true" />
                        <span className="flex-1">{locationText(req)}</span>
                        {directionsUrl(req) && (
                          <a href={directionsUrl(req)} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-semibold text-indigo-600">
                            Directions
                          </a>
                        )}
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
                      <Button className="flex-[2]" icon={Send} onClick={() => openOffer(req)} disabled={maxed || !!runningTrip}>
                        {runningTrip ? 'Finish current trip first' : maxed ? 'No offers left' : attempts > 0 ? `Send new offer (${MAX_OFFERS - attempts} left)` : 'Send offer'}
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
              <p className="text-gray-600">{locationText(selected)}{formatKm(distanceKm(myPos, selected)) ? ` · ${formatKm(distanceKm(myPos, selected))} away` : ''}</p>
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
