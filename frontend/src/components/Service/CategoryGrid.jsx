import { Link } from 'react-router-dom';
import { getCategoryIcon } from '../../lib/categories';

/**
 * Popular services: a horizontal scroller on phones, a grid on larger screens.
 * `layout="scroll"` forces the scroller everywhere, `layout="chips"` renders pills.
 */
export default function CategoryGrid({ categories = [], activeId, onSelect, layout = 'responsive', className = '' }) {
  if (layout === 'chips') {
    return (
      <div className={`flex gap-2 overflow-x-auto no-scrollbar ${className}`} role="list">
        {categories.map((c) => {
          const active = String(activeId) === String(c.id);
          const Icon = getCategoryIcon(c.name);
          return (
            <button
              key={c.id}
              type="button"
              role="listitem"
              aria-pressed={active}
              onClick={() => onSelect?.(c)}
              className={`shrink-0 h-10 px-3.5 rounded-sm border text-sm font-medium inline-flex items-center gap-1.5 ${
                active ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {c.name}
            </button>
          );
        })}
      </div>
    );
  }

  const wrapper =
    layout === 'scroll'
      ? 'flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4'
      : 'flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-5 lg:grid-cols-10 sm:overflow-visible';

  return (
    <ul className={`${wrapper} ${className}`}>
      {categories.map((c) => {
        const Icon = getCategoryIcon(c.name);
        return (
          <li key={c.id} className="shrink-0 w-[76px] sm:w-auto">
            <Link to={`/services/${c.id}`} className="group flex flex-col items-center gap-2 rounded-md p-1 text-center">
              <span className="h-16 w-16 rounded-md bg-white border border-gray-200 flex items-center justify-center transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50">
                <Icon className="h-7 w-7 text-indigo-500" aria-hidden="true" />
              </span>
              <span className="text-xs font-medium text-gray-700 leading-tight line-clamp-2">{c.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
