/**
 * Underline tabs (Groww-style): plain labels on a hairline, the active one
 * in indigo with a bar underneath. Scrolls sideways when there are many.
 *
 * tabs: [{ id, label, count? }]
 */
export default function Tabs({ tabs, value, onChange, label, stretch = false, className = '' }) {
  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <div role="tablist" aria-label={label} className={`flex overflow-x-auto no-scrollbar ${stretch ? '' : 'gap-6'}`}>
        {tabs.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.id)}
              className={`relative shrink-0 h-11 text-sm font-semibold tracking-wide transition-colors ${stretch ? 'flex-1 px-2' : ''} ${
                active ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
              {t.count > 0 && <span className={`ml-1.5 text-xs ${active ? 'text-indigo-400' : 'text-gray-400'}`}>{t.count}</span>}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-sm transition-colors ${active ? 'bg-indigo-500' : 'bg-transparent'}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
