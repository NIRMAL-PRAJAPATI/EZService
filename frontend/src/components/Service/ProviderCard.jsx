import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, MapPin } from 'lucide-react';
import ServiceImage from '../ui/ServiceImage';
import Rating from '../ui/Rating';
import { formatPrice } from '../../lib/format';

const placeLabel = (s) => [s.city, s.state].filter(Boolean).join(', ');
const categoryName = (s) => s.category?.name || s.ServiceCategory?.name || '';

/**
 * A service offered by a provider. Priority: photo → provider → rating →
 * verification → area → starting price → Book Now.
 * layout="row" is a compact horizontal card for lists on phones.
 */
export default function ProviderCard({ service, layout = 'card' }) {
  const navigate = useNavigate();
  const provider = service?.ProviderInfo?.name;
  const verified = !!service?.badge_status;
  const place = placeLabel(service);
  const cat = categoryName(service);

  const book = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/book?serviceId=${service.id}`);
  };

  if (layout === 'row') {
    return (
      <Link to={`/service/${service.id}`} className="flex gap-3 bg-white px-4 py-4 hover:bg-gray-50 transition-colors">
        <ServiceImage src={service.cover_image} alt={service.name} category={cat} className="h-24 w-24 shrink-0 rounded-sm" />
        <div className="min-w-0 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-1">{service.name}</h3>
          {provider && <p className="text-sm text-gray-600 truncate">{provider}</p>}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Rating value={service.average_rating} />
            {verified && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-700">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
              </span>
            )}
          </div>
          {place && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 truncate">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {place}
            </p>
          )}
          <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              From <span className="font-semibold text-gray-900">{formatPrice(service.visiting_charge)}</span>
            </p>
            <button type="button" onClick={book} className="h-9 px-4 rounded-sm bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600">
              Book
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/service/${service.id}`} className="group flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white hover:border-indigo-300 transition-colors">
      <div className="relative">
        <ServiceImage src={service.cover_image} alt={service.name} category={cat} className="h-40 w-full" iconClassName="h-10 w-10" />
        {verified && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-white/95 px-2 py-0.5 text-xs font-semibold text-green-700 shadow-sm">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-1">{service.name}</h3>
        {provider && <p className="text-sm text-gray-600 truncate">{provider}</p>}
        <div className="mt-1.5">
          <Rating value={service.average_rating} />
        </div>
        {place && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {place}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <p className="text-sm text-gray-600 leading-tight">
            Starting from
            <span className="block text-base font-semibold text-gray-900">{formatPrice(service.visiting_charge)}</span>
          </p>
          <button type="button" onClick={book} className="h-10 px-4 rounded-sm bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
}
