import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui/ServiceImage';

function UserReview({ post }) {
  const customerName = post.CustomerInfo?.name || 'Customer';
  const providerName = post.ProviderInfo?.name || 'Provider';
  const rating = Math.round(post.rating || 0);

  return (
    <article className="break-inside-avoid mb-3 rounded-md border border-gray-200 bg-white p-4">
      <header className="flex items-center gap-3">
        <Avatar name={customerName} size="h-10 w-10" className="text-sm" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{customerName}</h3>
          {rating > 0 ? (
            <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} aria-hidden="true" />
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Review</p>
          )}
        </div>
        <span className="text-xs text-gray-400 shrink-0">{post.created ? formatDistanceToNow(new Date(post.created), { addSuffix: true }) : ''}</span>
      </header>
      <p className="mt-3 text-sm text-gray-700">{post.message}</p>
      {post.image && <img src={post.image} alt="Attached by the customer" loading="lazy" className="mt-3 w-full max-h-56 object-cover rounded-sm" />}
      {post.hashtags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {post.hashtags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-indigo-600">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-gray-500">
        About <span className="font-semibold text-gray-800">{providerName}</span>
      </p>
    </article>
  );
}

export default UserReview;
