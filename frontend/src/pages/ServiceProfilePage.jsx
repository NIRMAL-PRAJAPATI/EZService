import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BadgeCheck, Briefcase, MapPin, Zap, Star, UserRound, Wrench } from 'lucide-react';
import api from '../config/axios-config';
import PageHeader from '../components/ui/PageHeader';
import ServiceImage, { Avatar } from '../components/ui/ServiceImage';
import Rating from '../components/ui/Rating';
import Button from '../components/ui/Button';
import { ErrorState } from '../components/ui/States';
import { PageSkeleton } from '../components/ui/Skeleton';
import { formatPrice, formatDate } from '../lib/format';

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'photos', label: 'Photos' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'areas', label: 'Service areas' },
];

const ServiceProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState('about');

  const load = () => {
    setLoading(true);
    setError(false);
    api
      .get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    api
      .get(`/reviews/service/${id}`)
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch(() => setReviews([]));
  };

  useEffect(load, [id]);

  if (loading) return <PageSkeleton />;
  if (error || !service || service.is_active === false) {
    return (
      <>
        <PageHeader title="Service" />
        <ErrorState title="Service not available" description="This service may have been removed. Please browse other professionals." onRetry={load} />
      </>
    );
  }

  const category = service.category?.name || '';
  const provider = service.ProviderInfo || {};
  const verified = !!service.badge_status;
  const areas = (service.locations || []).filter(Boolean);
  const place = [service.city, service.state].filter(Boolean).join(', ');
  const photos = (service.working_images || []).filter(Boolean);
  const specs = (service.specifications || []).filter(Boolean);
  const hasInstant = service.instant_visiting_charge !== null && service.instant_visiting_charge !== undefined;

  const book = () => navigate(`/book?serviceId=${service.id}`);
  const instant = () => navigate(`/instant-service?category=${service.category_id || ''}`);

  return (
    <div className="pb-28 md:pb-10">
      <PageHeader title={service.name} subtitle={category} backTo={service.category_id ? `/services/${service.category_id}` : '/services'} />

      <div className="max-w-5xl mx-auto md:px-6 md:pt-6 md:grid md:grid-cols-[1fr_320px] md:gap-6">
        <div>
          {/* Trust header */}
          <section className="bg-white md:rounded-md md:border md:border-gray-200 overflow-hidden">
            <ServiceImage src={service.cover_image} alt={service.name} category={category} className="h-52 md:h-64 w-full" iconClassName="h-14 w-14" />
            <div className="p-4 md:p-6">
              <p className="text-sm font-medium text-indigo-600">{category}</p>
              <h1 className="text-2xl font-extrabold tracking-wide text-gray-900 leading-tight">{service.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Rating value={service.average_rating} count={reviews.length} />
                {verified && (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" /> Verified professional
                  </span>
                )}
              </div>

              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                {provider.name && (
                  <li className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" /> {provider.name}
                  </li>
                )}
                {place && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" /> {place}
                  </li>
                )}
                {service.experience > 0 && (
                  <li className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" aria-hidden="true" /> {service.experience} year{service.experience === 1 ? '' : 's'} experience
                  </li>
                )}
                {hasInstant && (
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gray-400" aria-hidden="true" /> Instant visits from {formatPrice(service.instant_visiting_charge)}
                  </li>
                )}
              </ul>
            </div>
          </section>

          {/* Details */}
          <section className="mt-2 md:mt-4 bg-white md:rounded-md md:border md:border-gray-200">
            <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-gray-100 px-2" role="tablist" aria-label="Service details">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 h-12 px-3 text-sm font-semibold border-b-2 -mb-px ${tab === t.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                >
                  {t.label}
                  {t.id === 'reviews' && reviews.length > 0 ? ` (${reviews.length})` : ''}
                  {t.id === 'photos' && photos.length > 0 ? ` (${photos.length})` : ''}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6" role="tabpanel">
              {tab === 'about' && (
                <div className="space-y-5">
                  <p className="text-gray-700 whitespace-pre-line">{service.description || 'The provider has not added a description yet.'}</p>
                  {specs.length > 0 && (
                    <div>
                      <h2 className="font-semibold text-gray-900 mb-2">What's included</h2>
                      <ul className="space-y-1.5">
                        {specs.map((s, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <Wrench className="h-4 w-4 mt-1 text-indigo-500 shrink-0" aria-hidden="true" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === 'photos' &&
                (photos.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {photos.map((src, i) => (
                      <a key={i} href={src} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-sm bg-gray-100">
                        <ServiceImage src={src} alt={`Work photo ${i + 1}`} category={category} className="h-full w-full" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No work photos yet.</p>
                ))}

              {tab === 'reviews' &&
                (reviews.length ? (
                  <ul className="divide-y divide-gray-100">
                    {reviews.map((r, i) => {
                      const name = r.CustomerInfo?.name || 'Customer';
                      const comment = Array.isArray(r.comment) ? r.comment.join(' ') : r.comment;
                      return (
                        <li key={r.id || i} className="py-3 first:pt-0 flex gap-3">
                          <Avatar name={name} size="h-9 w-9" className="text-sm" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2">
                              <p className="font-semibold text-gray-900">{name}</p>
                              <span className="inline-flex items-center gap-0.5 text-sm">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                                {r.rating}
                              </span>
                              {r.created && <span className="text-xs text-gray-400">{formatDate(r.created)}</span>}
                            </div>
                            {comment && <p className="text-sm text-gray-700 mt-0.5">{comment}</p>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No reviews yet. Reviews appear here after customers complete a booking.</p>
                ))}

              {tab === 'areas' &&
                (areas.length || place ? (
                  <ul className="flex flex-wrap gap-2">
                    {(areas.length ? areas : [place]).map((a) => (
                      <li key={a} className="inline-flex items-center gap-1 rounded-sm bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {a}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">The provider has not listed service areas.</p>
                ))}
            </div>
          </section>
        </div>

        {/* Booking panel: sticky bar on phones, side card on desktop */}
        <aside className="fixed md:sticky inset-x-0 bottom-0 md:bottom-auto z-30 md:z-auto border-t md:border border-gray-200 bg-white md:rounded-md p-4 md:p-5 md:self-start md:sticky md:top-36 bottom-safe">
          <div className="flex md:block items-center gap-3">
            <div className="flex-1 md:mb-4">
              <p className="text-xs text-gray-500">Starting from</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(service.visiting_charge)}</p>
              <p className="hidden md:block text-xs text-gray-500">Visiting charge. Final price depends on the work needed.</p>
            </div>
            <div className="flex md:flex-col gap-2">
              <div className="hidden sm:block">
                <Button variant="secondary" icon={Zap} onClick={instant} className="md:w-full">
                  Instant Service
                </Button>
              </div>
              <Button onClick={book} className="md:w-full px-6">
                Book Now
              </Button>
            </div>
          </div>
          <button type="button" onClick={instant} className="sm:hidden mt-2 w-full text-center text-sm font-semibold text-indigo-600 py-1">
            Need someone right now? Get Instant Service
          </button>
        </aside>
      </div>
    </div>
  );
};

export default ServiceProfilePage;
