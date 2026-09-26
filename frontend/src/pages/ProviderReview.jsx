import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../config/axios-config';
import authApi from '../config/auth-config';
import { ProviderPage } from '../components/layout/ProviderLayout';
import { Avatar } from '../components/ui/ServiceImage';
import { CardListSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { formatDate } from '../lib/format';

/** All customer reviews across the provider's services. */
function ProviderReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    authApi
      .get('/provider/services')
      .then((res) => {
        const services = Array.isArray(res.data) ? res.data : [];
        return Promise.all(
          services.map((s) =>
            api
              .get(`/reviews/service/${s.id}`)
              .then((r) => (Array.isArray(r.data) ? r.data : []).map((rev) => ({ ...rev, serviceName: s.name })))
              .catch(() => [])
          )
        );
      })
      .then((lists) => setReviews(lists.flat().sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0))))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <ProviderPage title="Reviews" subtitle="What customers said after their service.">
      {loading ? (
        <CardListSkeleton count={3} />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : reviews.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white">
          <EmptyState icon={MessageSquare} title="No reviews yet" description="Customers can review you after you mark their booking as completed." />
        </div>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r, i) => {
            const name = r.CustomerInfo?.name || 'Customer';
            const comment = Array.isArray(r.comment) ? r.comment.join(' ') : r.comment;
            return (
              <li key={r.id || i} className="rounded-md border border-gray-200 bg-white p-4 flex gap-3">
                <Avatar name={name} size="h-10 w-10" className="text-sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900">{name}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" /> {r.rating}
                    </span>
                  </div>
                  {comment && <p className="text-sm text-gray-700 mt-0.5">{comment}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {r.serviceName}
                    {r.created ? ` · ${formatDate(r.created)}` : ''}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ProviderPage>
  );
}

export default ProviderReview;
