import { AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function UserComp({ post }) {
  const customerName = post.CustomerInfo?.name || 'Customer';
  const providerName = post.ProviderInfo?.name || 'Provider';

  return (
    <article className="break-inside-avoid mb-3 rounded-md border border-gray-200 bg-white p-4">
      <header className="flex items-center gap-3">
        <span className="h-10 w-10 shrink-0 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{post.subject || 'Complaint'}</h3>
          <p className="text-xs text-gray-500">Complaint by {customerName}</p>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{post.created ? formatDistanceToNow(new Date(post.created), { addSuffix: true }) : ''}</span>
      </header>
      <p className="mt-3 text-sm text-gray-700">{post.message}</p>
      {post.image && <img src={post.image} alt="Attached by the customer" loading="lazy" className="mt-3 w-full max-h-56 object-cover rounded-sm" />}
      <p className="mt-3 text-xs text-gray-500">
        About <span className="font-semibold text-gray-800">{providerName}</span>
      </p>
    </article>
  );
}

export default UserComp;
