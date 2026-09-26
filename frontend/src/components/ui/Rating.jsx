import { Star } from 'lucide-react';

/**
 * Compact rating: "★ 4.8 · 12 reviews". Shows "New" when there is no rating yet
 * instead of a misleading 0.0.
 */
export default function Rating({ value, count, className = '' }) {
  const n = Number(value);
  const hasRating = value !== null && value !== undefined && !Number.isNaN(n) && n > 0;

  if (!hasRating) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-gray-500 ${className}`}>
        <Star className="h-3.5 w-3.5 text-gray-300" aria-hidden="true" />
        New
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`} aria-label={`Rated ${n.toFixed(1)} out of 5`}>
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
      <span className="font-semibold text-gray-900">{n.toFixed(1)}</span>
      {count > 0 && <span className="text-gray-500">· {count} review{count === 1 ? '' : 's'}</span>}
    </span>
  );
}

export function StarInput({ value, onChange, size = 'h-8 w-8' }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="p-1 rounded-sm"
        >
          <Star className={`${size} ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}
