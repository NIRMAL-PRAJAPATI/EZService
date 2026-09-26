import { useState } from 'react';
import { getCategoryIcon } from '../../lib/categories';

/**
 * Image with a clean fallback: when there is no URL or it fails to load we show
 * a soft tile with the category icon instead of a broken-image glyph.
 */
export default function ServiceImage({ src, alt = '', category = '', className = '', iconClassName = 'h-8 w-8' }) {
  const [failed, setFailed] = useState(false);
  const Icon = getCategoryIcon(category || alt);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-indigo-50 text-indigo-400 ${className}`} role="img" aria-label={alt || 'No photo'}>
        <Icon className={iconClassName} aria-hidden="true" />
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export function Avatar({ name = '', size = 'h-10 w-10', className = '' }) {
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?';
  return (
    <div className={`${size} shrink-0 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center ${className}`} aria-hidden="true">
      {initials}
    </div>
  );
}
