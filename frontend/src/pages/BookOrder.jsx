import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { addDays, format, isToday, setHours, setMinutes, startOfHour, addHours } from 'date-fns';
import { MapPin, Plus, Check, Clock, FileText, LogIn } from 'lucide-react';
import api from '../config/axios-config';
import authApi from '../config/auth-config';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import OutlinedField from '../components/ui/OutlinedField';
import ServiceImage from '../components/ui/ServiceImage';
import { EmptyState, ErrorState, InlineError } from '../components/ui/States';
import { PageSkeleton } from '../components/ui/Skeleton';
import { formatPrice, formatDateTime } from '../lib/format';
import { getAuthUser } from '../lib/auth';
import { getSavedAddress, getDeviceAddresses, saveDeviceAddress } from '../lib/location';

const STEPS = ['Service', 'Time', 'Location', 'Confirm'];
const SLOT_HOURS = [9, 10, 11, 12, 14, 15, 16, 17, 18, 19];

const BookOrderPage = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAuthUser();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [step, setStep] = useState(0);
  const [issue, setIssue] = useState('');
  const [day, setDay] = useState(0); // offset from today
  const [hour, setHour] = useState(null);
  const [addresses, setAddresses] = useState(() => {
    const saved = getSavedAddress();
    const device = getDeviceAddresses();
    const list = saved ? [{ label: 'Home', text: saved }, ...device.filter((a) => a.text !== saved)] : device;
    return list;
  });
  const [address, setAddress] = useState(() => addresses[0]?.text || '');
  const [adding, setAdding] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({ label: 'Home', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    api
      .get(`/services/${serviceId}`)
      .then((res) => setService(res.data))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };
  useEffect(load, [serviceId]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)), []);
  const earliest = addHours(startOfHour(new Date()), 2);
  const slotsForDay = SLOT_HOURS.map((h) => setMinutes(setHours(days[day], h), 0)).filter((d) => !isToday(d) || d >= earliest);

  const visitDate = hour !== null ? setMinutes(setHours(days[day], hour), 0) : null;

  const canContinue = [issue.trim().length >= 5, !!visitDate, !!address.trim(), true][step];

  const next = () => {
    setError('');
    if (step < STEPS.length - 1) setStep(step + 1);
  };
  const back = () => (step === 0 ? navigate(-1) : setStep(step - 1));

  const addAddress = () => {
    const text = newAddress.text.trim();
    if (!text) return;
    const entry = { label: newAddress.label.trim() || 'Address', text };
    const deviceList = saveDeviceAddress(entry);
    const saved = getSavedAddress();
    setAddresses(saved ? [...deviceList.filter((a) => a.text !== saved), { label: 'Home', text: saved }] : deviceList);
    setAddress(text);
    setAdding(false);
    setNewAddress({ label: 'Home', text: '' });
  };

  const confirm = () => {
    setSubmitting(true);
    setError('');
    authApi
      .post('/orders', {
        service_id: service.id,
        provider_id: service.ProviderInfo?.id || service.provider_id,
        date: visitDate.toISOString(),
        estimated_charge: service.visiting_charge,
        status: 'PENDING',
        issue: issue.trim(),
        location: address.trim(),
      })
      .then((res) => navigate(`/orders/${res.data.order_id}/view`, { replace: true, state: { justBooked: true } }))
      .catch((err) => {
        setError(err.response?.data?.message || "We couldn't place your booking. Please try again.");
        setSubmitting(false);
      });
  };

  if (!user || user.role !== 'customer') {
    return (
      <>
        <PageHeader title="Book a service" />
        <EmptyState
          icon={LogIn}
          title="Log in to book"
          description="You need a customer account to book a professional. It only takes a minute."
          actionLabel="Log in"
          onAction={() => navigate('/login', { state: { from: `${location.pathname}${location.search}` } })}
        />
      </>
    );
  }
  if (loading) return <PageSkeleton />;
  if (!serviceId || loadError || !service || service.is_active === false) {
    return (
      <>
        <PageHeader title="Book a service" />
        <ErrorState title="Service not found" description="Please pick a service to book." onRetry={serviceId ? load : undefined} />
        <div className="flex justify-center">
          <Button variant="secondary" to="/services">
            Browse services
          </Button>
        </div>
      </>
    );
  }

  const category = service.category?.name || '';

  return (
    <div className="min-h-screen md:min-h-0 pb-28">
      <PageHeader title={`Book ${service.name}`} subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`} onBack={back} />

      <div className="max-w-2xl mx-auto px-4 pt-4">
        {/* Progress */}
        <ol className="grid grid-cols-4 gap-1.5 mb-5" aria-label="Booking progress">
          {STEPS.map((label, i) => (
            <li key={label} aria-current={i === step ? 'step' : undefined}>
              <span className={`block h-1.5 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-gray-200'}`} />
              <span className={`mt-1.5 block text-[11px] font-medium ${i === step ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
            </li>
          ))}
        </ol>

          <motion.div key={step} initial={{ opacity: 0.4, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
            {step === 0 && (
              <section className="space-y-5">
                <div className="flex gap-3 rounded-md bg-white border border-gray-200 p-3">
                  <ServiceImage src={service.cover_image} alt={service.name} category={category} className="h-16 w-16 rounded-sm shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-indigo-600">{category}</p>
                    <h2 className="font-semibold text-gray-900 truncate">{service.name}</h2>
                    <p className="text-sm text-gray-600 truncate">{service.ProviderInfo?.name}</p>
                    <p className="text-sm text-gray-600">
                      Starting from <span className="font-semibold text-gray-900">{formatPrice(service.visiting_charge)}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-wide text-gray-900 mb-3">What do you need done?</h2>
                  <OutlinedField
                    as="textarea"
                    rows={4}
                    label="Describe the problem"
                    icon={FileText}
                    name="issue"
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder='For example: "Kitchen tap is leaking" or "AC not cooling"'
                    hint="This helps the professional come prepared."
                  />
                </div>
              </section>
            )}

            {step === 1 && (
              <section>
                <h2 className="text-lg font-bold tracking-wide text-gray-900">When should the provider come?</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Pick a date and time. Need help right now? Use{' '}
                  <Link to={`/instant-service${service.category_id ? `?category=${service.category_id}` : ''}`} className="font-medium text-indigo-600">Instant Service</Link> instead.
                </p>

                {(
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Select date</h3>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
                        {days.map((d, i) => (
                          <button
                            key={i}
                            type="button"
                            aria-pressed={day === i}
                            onClick={() => {
                              setDay(i);
                              setHour(null);
                            }}
                            className={`shrink-0 w-[72px] rounded-sm border py-2 text-center ${day === i ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700'}`}
                          >
                            <span className="block text-xs font-medium">{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(d, 'EEE')}</span>
                            <span className="block text-lg font-semibold">{format(d, 'd')}</span>
                            <span className="block text-[11px] text-gray-500">{format(d, 'MMM')}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Select time <span className="font-normal text-gray-500">(approximate time the provider will arrive)</span></h3>
                      {slotsForDay.length === 0 ? (
                        <p className="text-sm text-gray-500">No more slots today. Please pick another day.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {slotsForDay.map((d) => {
                            const h = d.getHours();
                            return (
                              <button
                                key={h}
                                type="button"
                                aria-pressed={hour === h}
                                onClick={() => setHour(h)}
                                className={`h-11 rounded-sm border text-sm font-medium ${hour === h ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                              >
                                {format(d, 'h a')}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section>
                <h2 className="text-lg font-bold tracking-wide text-gray-900 mb-3">Where should we come?</h2>
                {addresses.length > 0 && (
                  <ul className="space-y-2" role="radiogroup" aria-label="Saved addresses">
                    {addresses.map((a) => (
                      <li key={a.text}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={address === a.text}
                          onClick={() => setAddress(a.text)}
                          className={`w-full text-left flex items-start gap-3 rounded-md border p-4 ${address === a.text ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 bg-white'}`}
                        >
                          <MapPin className={`h-5 w-5 mt-0.5 shrink-0 ${address === a.text ? 'text-indigo-500' : 'text-gray-400'}`} aria-hidden="true" />
                          <span className="flex-1">
                            <span className="block font-semibold text-gray-900">{a.label}</span>
                            <span className="block text-sm text-gray-600">{a.text}</span>
                          </span>
                          {address === a.text && <Check className="h-5 w-5 text-indigo-500" aria-hidden="true" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {adding ? (
                  <div className="mt-4 space-y-4 rounded-md border border-gray-200 bg-white p-4">
                    <OutlinedField label="Label" name="address-label" value={newAddress.label} onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))} placeholder="Home, Office…" />
                    <OutlinedField
                      as="textarea"
                      rows={3}
                      label="Full address"
                      name="address-text"
                      value={newAddress.text}
                      onChange={(e) => setNewAddress((p) => ({ ...p, text: e.target.value }))}
                      placeholder="House / flat, street, area, city, PIN"
                      autoComplete="street-address"
                    />
                    <div className="flex gap-2">
                      {addresses.length > 0 && (
                        <Button variant="secondary" className="flex-1" onClick={() => setAdding(false)}>
                          Cancel
                        </Button>
                      )}
                      <Button className="flex-1" onClick={addAddress} disabled={!newAddress.text.trim()}>
                        Use this address
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Saved on this device for next time.</p>
                  </div>
                ) : (
                  <Button variant="secondary" icon={Plus} block className="mt-3" onClick={() => setAdding(true)}>
                    Add new address
                  </Button>
                )}
              </section>
            )}

            {step === 3 && (
              <section>
                <h2 className="text-lg font-bold tracking-wide text-gray-900 mb-3">Confirm booking</h2>
                <div className="rounded-md border border-gray-200 bg-white divide-y divide-gray-100">
                  <div className="p-4 flex gap-3">
                    <ServiceImage src={service.cover_image} alt={service.name} category={category} className="h-12 w-12 rounded-sm shrink-0" iconClassName="h-6 w-6" />
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.ProviderInfo?.name}</p>
                    </div>
                  </div>
                  <SummaryRow icon={Clock} label="When" value={`${formatDateTime(visitDate)} (approx.)`} onEdit={() => setStep(1)} />
                  <SummaryRow icon={MapPin} label="Where" value={address} onEdit={() => setStep(2)} />
                  <SummaryRow icon={FileText} label="Problem" value={issue} onEdit={() => setStep(0)} />
                  <div className="p-4 space-y-1.5">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Visiting charge</span>
                      <span>{formatPrice(service.visiting_charge)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>To pay now</span>
                      <span>₹0</span>
                    </div>
                    <p className="text-xs text-gray-500">Pay the professional after the visit. The final amount depends on the work needed.</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">The provider will confirm your booking. You can track it from Bookings.</p>
                <div className="mt-3">
                  <InlineError>{error}</InlineError>
                </div>
              </section>
            )}
          </motion.div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white bottom-safe">
        <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2">
          {step > 0 && (
            <Button variant="secondary" onClick={back} className="px-5">
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button block onClick={next} disabled={!canContinue}>
              Continue
            </Button>
          ) : (
            <Button block onClick={confirm} loading={submitting}>
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

function SummaryRow({ icon: Icon, label, value, onEdit }) {
  return (
    <div className="p-4 flex items-start gap-3">
      <Icon className="h-5 w-5 mt-0.5 text-gray-400 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="text-sm font-semibold text-indigo-600 px-2 py-1 rounded-sm hover:bg-indigo-50">
        Change
      </button>
    </div>
  );
}

export default BookOrderPage;
