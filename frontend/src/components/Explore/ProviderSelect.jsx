import { useEffect, useRef, useState } from 'react';
import { Search, X, UserCheck } from 'lucide-react';
import api from '../../config/axios-config';

function ProviderSelect({ value, onChange }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      api.get(`/provider/search?q=${encodeURIComponent(query.trim())}`)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (provider) => {
    onChange(provider);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {value ? (
        <div className="flex items-center justify-between w-full border border-indigo-300 bg-indigo-50/40 px-3 py-3 rounded-sm text-sm">
          <span className="flex items-center gap-1.5 text-indigo-700 font-medium truncate">
            <UserCheck className="h-4 w-4 flex-shrink-0" />
            {value.name}
          </span>
          <button type="button" onClick={() => onChange(null)} className="text-gray-400 hover:text-red-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search provider by name..."
            className="w-full border px-3 py-3 pl-9 rounded-sm text-base md:text-sm border-gray-300 outline-none focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      )}

      {open && !value && query.trim() && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-md max-h-48 overflow-y-auto">
          {loading ? (
            <p className="px-3 py-2 text-xs text-gray-500">Searching...</p>
          ) : results.length > 0 ? (
            results.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-3 text-sm hover:bg-indigo-50 flex items-center justify-between"
              >
                <span className="truncate">{p.name}</span>
                {p.city && <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{p.city}</span>}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-gray-500">No providers found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProviderSelect;
