import { Search, X } from 'lucide-react';

/**
 * Search field. Submits on Enter (onSubmit) and can also filter live (onChange).
 */
export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search for plumber, AC repair, cleaning…', autoFocus = false, className = '', id = 'service-search' }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search services
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        enterKeyHint="search"
        className="w-full h-12 rounded-sm border border-gray-300 bg-white pl-12 pr-11 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange?.('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
