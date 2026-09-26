import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Clock, FileText, Zap, LogIn, BadgeIndianRupee, ChevronDown, ArrowLeft } from 'lucide-react';
import Lottie from 'lottie-react';
import providerFindAnimation from '../assets/animation2.json';
import { io } from 'socket.io-client';
import authApi from '../config/auth-config';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import OutlinedField from '../components/ui/OutlinedField';
import BottomSheet from '../components/ui/BottomSheet';
import Rating from '../components/ui/Rating';
import { Avatar } from '../components/ui/ServiceImage';
import { EmptyState, InlineError } from '../components/ui/States';
import { Skeleton } from '../components/ui/Skeleton';
import { getCategoryIcon } from '../lib/categories';
import { getSavedAddress, getCity } from '../lib/location';
import { getAuthUser } from '../lib/auth';
import { formatPrice } from '../lib/format';

const SOCKET_URL = import.meta.env.VITE_API_BACKEND_API || 'http://localhost:3000';

const InstantService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = getAuthUser();
  const isCustomer = user?.role === 'customer';

  const [formData, setFormData] = useState({
    address: getSavedAddress() || getCity() || '',
    serviceType: searchParams.get('category') || '',
    description: '',
  });
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchStartedAt, setSearchStartedAt] = useState(null);
  const [error, setError] = useState('');
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [offerAttempts, setOfferAttempts] = useState({});
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const socket = useRef(null);
  // Mirrors state that the socket listener (registered once per connection) needs
  // to read with up-to-date values, since its closure would otherwise go stale.
  const currentRequestIdRef = useRef(null);
  const offerAttemptsRef = useRef({});

  useEffect(() => {
    currentRequestIdRef.current = currentRequestId;
  }, [currentRequestId]);

  useEffect(() => {
    offerAttemptsRef.current = offerAttempts;
  }, [offerAttempts]);

  // The search screen covers the whole page; stop the page behind it from scrolling.
  useEffect(() => {
    if (!searching) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, [searching]);

  const connectSocket = useCallback(() => {
    const s = io(SOCKET_URL);
    socket.current = s;

    if (user?.id) {
      s.emit('identify', { userType: 'customer', userId: user.id });
    }

    s.on('serviceOffer', (offer) => {
      const activeRequestId = currentRequestIdRef.current;

      // Ignore any offer that isn't for the request we're currently tracking
      if (!activeRequestId || offer.requestId !== activeRequestId) return;

      // Respect the per provider+service attempt limit for this request
      if (offer.provider?.id && offer.service?.id) {
        const attemptKey = `${offer.provider.id}_${offer.service.id}`;
        const requestAttempts = offerAttemptsRef.current[activeRequestId] || {};
        if ((requestAttempts[attemptKey] || 0) >= 3) {
          s.emit('offerRejected', {
            providerId: offer.provider.id,
            serviceId: offer.service.id,
            requestId: activeRequestId,
            reason: 'MAX_ATTEMPTS_REACHED',
          });
          return;
        }
      }

      // One live offer per provider: a newer offer replaces the older one.
      setOffers((prev) => [...prev.filter((o) => o.provider?.id !== offer.provider?.id), offer]);
    });

    return s;
    // user.id is stable for the life of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCustomer) return undefined;
    connectSocket();

    authApi
      .get('/category/names')
      .then((response) => setServiceTypes(response.data || []))
      .catch(() => setError("We couldn't load services. Please refresh the page."))
      .finally(() => setTypesLoading(false));

    authApi
      .get('/customer/profile')
      .then((res) => setCustomerName(res.data?.name || ''))
      .catch(() => {});

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [isCustomer, connectSocket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedType = serviceTypes.find((t) => String(t.id) === String(formData.serviceType));

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!formData.serviceType) return setError('Please choose a service.');
    if (!formData.address.trim()) return setError('Please add the address where you need the service.');
    if (formData.description.trim().length < 5) return setError('Please describe the problem in a few words.');

    setLoading(true);
    authApi
      .post('/service-requests', formData)
      .then((response) => {
        setLoading(false);
        setSearching(true);
        setSearchStartedAt(new Date());
        setOffers([]);

        const requestId = response.data.id;
        setCurrentRequestId(requestId);
        currentRequestIdRef.current = requestId;
        setOfferAttempts((prev) => ({ ...prev, [requestId]: {} }));

        // Broadcast the request to online providers in this category
        socket.current?.emit('newServiceRequest', {
          requestId,
          ...formData,
          categoryName: selectedType?.name,
          customerName,
        });
      })
      .catch(() => {
        setError("We couldn't send your request. Please try again.");
        setLoading(false);
      });
  };

  const stopSearching = () => {
    // Disconnecting makes the server delete the pending request.
    socket.current?.disconnect();
    socket.current = null;
    setSearching(false);
    setOffers([]);
    setCurrentRequestId(null);
    currentRequestIdRef.current = null;
    connectSocket();
  };

  const handleConfirmOrder = () => {
    setConfirmLoading(true);
    setError('');

    const orderData = {
      service_id: selectedOffer.service.id,
      provider_id: selectedOffer.provider.id,
      location: formData.address,
      issue: formData.description,
      date: new Date().toISOString(),
      estimated_charge: selectedOffer.price,
      status: 'CONFIRMED',
      request_id: currentRequestId,
    };

    authApi
      .post('/orders', orderData)
      .then((response) => {
        socket.current?.emit('offerAccepted', {
          offerId: selectedOffer.id,
          providerId: selectedOffer.provider.id,
          requestId: currentRequestId,
        });
        navigate(`/orders/${response.data.order_id || response.data.id}/view`, { replace: true, state: { justBooked: true } });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "We couldn't confirm this professional. Please try again.");
        setConfirmLoading(false);
      });
  };

  const handleDeclineOffer = (offer) => {
    const { id: offerId } = offer;
    const providerId = offer.provider?.id;
    const serviceId = offer.service?.id;
    setOffers((prev) => prev.filter((o) => o.id !== offerId));

    if (currentRequestId && serviceId && socket.current) {
      const attemptKey = `${providerId}_${serviceId}`;
      const requestAttempts = offerAttempts[currentRequestId] || {};
      const attempts = requestAttempts[attemptKey] || 0;

      if (attempts >= 2) {
        socket.current.emit('offerDeclined', { offerId, providerId, serviceId, requestId: currentRequestId, maxAttemptsReached: true });
      } else {
        setOfferAttempts((prev) => ({
          ...prev,
          [currentRequestId]: { ...prev[currentRequestId], [attemptKey]: attempts + 1 },
        }));
        socket.current.emit('offerDeclined', { offerId, providerId, serviceId, requestId: currentRequestId, attemptsRemaining: 2 - attempts });
      }
    } else if (socket.current) {
      socket.current.emit('offerDeclined', { offerId, providerId });
    }
  };

  if (!isCustomer) {
    return (
      <>
        <PageHeader title="Instant Service" />
        <EmptyState
          icon={LogIn}
          title="Log in to request help"
          description="Instant Service sends your request to available professionals nearby. Log in to continue."
          actionLabel="Log in"
          onAction={() => navigate('/login', { state: { from: `${location.pathname}${location.search}` } })}
        />
      </>
    );
  }

  /* ---------- Searching / offers ---------- */
  if (searching) {
    const TypeIcon = getCategoryIcon(selectedType?.name || '');
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-gray-50">
        {/* Map-like backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/*
          Full-page search animation. Its center sits on the bottom edge of the
          screen, so the waves rise from the bottom to the top. It is sized to
          4x the distance from that point to the farthest top corner, so the
          first half of each wave already covers the whole page.
        */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Lottie
            animationData={providerFindAnimation}
            loop
            className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 max-w-none w-[440vmax] h-[440vmax] opacity-70"
            style={{ width: 'calc(4 * hypot(50vw, 100vh))', height: 'calc(4 * hypot(50vw, 100vh))' }}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
          />
        </div>

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 px-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))]">
          <button
            type="button"
            onClick={stopSearching}
            className="h-11 w-11 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50"
            aria-label="Cancel request and go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {selectedType && (
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-white border border-gray-200 shadow-sm px-3 h-9 text-sm font-semibold text-gray-800">
              <TypeIcon className="h-4 w-4 text-indigo-500" aria-hidden="true" /> {selectedType.name}
            </span>
          )}
        </div>

        {/* Bottom panel: offers + cancel */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-2xl rounded-t-lg border-t border-gray-200 bg-white px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_30px_rgba(15,23,42,0.08)]">
            {offers.length > 0 ? (
              <>
                <div className="flex items-baseline justify-between gap-3 mb-3" aria-live="polite">
                  <h2 className="text-lg font-bold tracking-wide text-gray-900">Professionals available</h2>
                  <span className="text-sm text-gray-500">
                    {offers.length} offer{offers.length === 1 ? '' : 's'}
                  </span>
                </div>
                <ul className="max-h-[55vh] overflow-y-auto space-y-3 -mx-1 px-1 pb-1">
                  <AnimatePresence initial={false}>
                    {offers.map((offer) => (
                      <motion.li
                        key={offer.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-md border border-gray-200 bg-white p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar name={offer.provider?.name || 'Provider'} size="h-12 w-12" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{offer.provider?.name || 'Service provider'}</p>
                            <Rating value={offer.provider?.rating} />
                            <p className="text-sm text-gray-500 truncate">{offer.service?.name || selectedType?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">{formatPrice(offer.price)}</p>
                            <p className="text-xs text-gray-500">visiting charge</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 rounded-sm bg-gray-50 px-3 py-2 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                          Arrives in <span className="font-semibold">{offer.estimatedArrival || 'about 30 min'}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="secondary" className="flex-1" onClick={() => handleDeclineOffer(offer)}>
                            Decline
                          </Button>
                          <Button className="flex-[2]" onClick={() => setSelectedOffer(offer)}>
                            Accept
                          </Button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <p className="mt-2 text-center text-xs text-gray-400">More offers may still arrive.</p>
              </>
            ) : (
              <div role="status" aria-live="polite">
                <div className="mx-auto mb-3 h-1 w-24 overflow-hidden rounded-full bg-indigo-100" aria-hidden="true">
                  <div className="h-full w-1/3 rounded-full bg-indigo-500 animate-[ez-search_1.4s_ease-in-out_infinite]" />
                </div>
                <h2 className="text-lg font-bold tracking-wide text-gray-900 text-center">Finding professionals near you…</h2>
                <p className="mt-1 text-sm text-gray-600 text-center">
                  We&apos;ve sent your request to available {selectedType?.name?.toLowerCase() || ''} professionals. Offers will appear here.
                </p>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {searchStartedAt ? `Request sent at ${searchStartedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · ` : ''}Keep this page open
                </p>
              </div>
            )}
            <Button variant="danger-outline" block onClick={stopSearching} className="mt-3">
              Cancel request
            </Button>
          </div>
        </div>

        <BottomSheet
          open={!!selectedOffer}
          onClose={() => !confirmLoading && setSelectedOffer(null)}
          title="Confirm professional"
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setSelectedOffer(null)} disabled={confirmLoading}>
                Back
              </Button>
              <Button className="flex-[2]" onClick={handleConfirmOrder} loading={confirmLoading}>
                Confirm · {formatPrice(selectedOffer?.price)}
              </Button>
            </div>
          }
        >
          {selectedOffer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={selectedOffer.provider?.name || 'Provider'} size="h-12 w-12" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedOffer.provider?.name}</p>
                  <p className="text-sm text-gray-500">Arrives in {selectedOffer.estimatedArrival || 'about 30 min'}</p>
                </div>
              </div>
              <dl className="rounded-sm border border-gray-200 divide-y divide-gray-100 text-sm">
                <div className="p-3">
                  <dt className="text-xs text-gray-500">Address</dt>
                  <dd className="text-gray-900">{formData.address}</dd>
                </div>
                <div className="p-3">
                  <dt className="text-xs text-gray-500">Problem</dt>
                  <dd className="text-gray-900">{formData.description}</dd>
                </div>
                <div className="p-3 flex justify-between font-semibold text-gray-900">
                  <dt>Visiting charge</dt>
                  <dd>{formatPrice(selectedOffer.price)}</dd>
                </div>
              </dl>
              <p className="text-xs text-gray-500">Pay the professional after the service.</p>
              <InlineError>{error}</InlineError>
            </div>
          )}
        </BottomSheet>
      </div>
    );
  }

  /* ---------- Request form ---------- */
  const visibleTypes = showAllTypes ? serviceTypes : serviceTypes.slice(0, 6);
  const typesToShow = selectedType && !visibleTypes.includes(selectedType) ? [selectedType, ...visibleTypes.slice(0, 5)] : visibleTypes;

  return (
    <div className="min-h-screen md:min-h-0 pb-28">
      <PageHeader title="Instant Service" subtitle="Get a professional at your door, fast" />
      <form id="instant-form" onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 pt-5 space-y-7">
        <section aria-labelledby="need-title">
          <h2 id="need-title" className="text-lg font-bold tracking-wide text-gray-900 mb-3">
            What do you need help with?
          </h2>
          {typesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-sm" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Service">
                {typesToShow.map((type) => {
                  const Icon = getCategoryIcon(type.name);
                  const active = String(type.id) === String(formData.serviceType);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setFormData((p) => ({ ...p, serviceType: String(type.id) }))}
                      className={`h-14 px-3 rounded-sm border flex items-center gap-2 text-left text-sm font-semibold ${
                        active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400'}`} aria-hidden="true" />
                      <span className="leading-tight">{type.name}</span>
                    </button>
                  );
                })}
              </div>
              {serviceTypes.length > 6 && (
                <button type="button" onClick={() => setShowAllTypes((v) => !v)} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 py-2">
                  {showAllTypes ? 'Show fewer' : 'Select another service'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAllTypes ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="where-title">
          <h2 id="where-title" className="text-lg font-bold tracking-wide text-gray-900 mb-3">
            Where do you need the service?
          </h2>
          <OutlinedField as="textarea" rows={2} label="Address" icon={MapPin} name="address" value={formData.address} onChange={handleChange} placeholder="House / flat, street, area, city" autoComplete="street-address" />
        </section>

        <section aria-labelledby="problem-title">
          <h2 id="problem-title" className="text-lg font-bold tracking-wide text-gray-900 mb-3">
            What's the problem?
          </h2>
          <OutlinedField
            as="textarea"
            rows={3}
            label="Describe the problem"
            icon={FileText}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder='For example: "AC not cooling" or "Bathroom pipe leaking"'
          />
        </section>

        <div className="flex items-start gap-3 rounded-md bg-white border border-gray-200 p-4 text-sm text-gray-600">
          <BadgeIndianRupee className="h-5 w-5 text-indigo-500 shrink-0" aria-hidden="true" />
          <p>Available professionals send you an offer with their price and arrival time. You choose who to accept. Nothing is charged now.</p>
        </div>

        <InlineError>{error}</InlineError>
      </form>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white bottom-safe">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Button type="submit" form="instant-form" block size="lg" icon={Zap} loading={loading}>
            Find a Professional
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstantService;
