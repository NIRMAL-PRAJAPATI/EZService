import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import api from '../config/axios-config';
import ServiceImage from '../components/ui/ServiceImage';
import Rating from '../components/ui/Rating';
import { CardListSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { formatPrice } from '../lib/format';

/** Top-rated services, ranked by the average rating customers gave them. */
function Rankings() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api
      .get('/services/?limit=100')
      .then((res) => {
        const rated = (res.data || []).filter((s) => Number(s.average_rating) > 0).sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
        setServices(rated.slice(0, 20));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0 py-5 md:py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900">Top-rated services</h1>
      <p className="text-sm text-gray-500">Ranked by the average rating from completed bookings.</p>

      <div className="mt-5">
        {loading ? (
          <CardListSkeleton count={4} />
        ) : error ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <ErrorState onRetry={load} />
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <EmptyState icon={Trophy} title="No ratings yet" description="Rankings appear once customers start rating completed services." actionLabel="Browse services" actionTo="/services" />
          </div>
        ) : (
          <ol className="space-y-3">
            {services.map((s, i) => (
              <li key={s.id}>
                <Link to={`/service/${s.id}`} className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 hover:border-indigo-300">
                  <span className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{i + 1}</span>
                  <ServiceImage src={s.cover_image} alt={s.name} category={s.category?.name} className="h-14 w-14 shrink-0 rounded-sm" iconClassName="h-6 w-6" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 truncate">{s.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {s.ProviderInfo?.name}
                      {s.city ? ` · ${s.city}` : ''}
                    </p>
                    <Rating value={s.average_rating} />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(s.visiting_charge)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default Rankings;
