import { useEffect, useState } from 'react';
import { ChevronDown, MapPin, Check } from 'lucide-react';
import BottomSheet from './ui/BottomSheet';
import OutlinedField from './ui/OutlinedField';
import Button from './ui/Button';
import { getCity, setCity, onCityChange, POPULAR_CITIES, titleCase } from '../lib/location';

/**
 * Shows the selected city ("📍 Ahmedabad ▾") and lets the customer change it
 * from a bottom sheet — pick a popular city or type one.
 */
export default function LocationSelector({ variant = 'inline', className = '' }) {
  const [city, setCityState] = useState(getCity());
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');

  useEffect(() => onCityChange((c) => setCityState(titleCase(c || ''))), []);

  const choose = (value) => {
    const next = titleCase(value.trim());
    if (!next) return;
    setCity(next);
    setCityState(next);
    setCustom('');
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group flex items-center gap-1.5 text-left min-h-11 ${className}`}
        aria-label={`Service location: ${city || 'not set'}. Change location`}
      >
        <MapPin className="h-5 w-5 text-indigo-500 shrink-0" aria-hidden="true" />
        {variant === 'stacked' ? (
          <span className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Service location</span>
            <span className="flex items-center gap-0.5 font-semibold text-gray-900">
              {city || 'Choose your city'}
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-800" aria-hidden="true" />
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-0.5 font-semibold text-gray-900">
            {city || 'Choose city'}
            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-800" aria-hidden="true" />
          </span>
        )}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Where do you need service?">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            choose(custom);
          }}
          className="flex gap-2 mt-3"
        >
          <OutlinedField label="City" name="city-input" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Type your city" className="flex-1" autoComplete="address-level2" />
          <Button type="submit" disabled={!custom.trim()} className="h-[50px]">
            Set
          </Button>
        </form>
        <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Popular cities</p>
        <ul className="grid grid-cols-2 gap-2">
          {POPULAR_CITIES.map((c) => {
            const active = c.toLowerCase() === (city || '').toLowerCase();
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => choose(c)}
                  className={`w-full h-11 px-3 rounded-sm border text-sm font-medium flex items-center justify-between ${
                    active ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {c}
                  {active && <Check className="h-4 w-4" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>
    </>
  );
}
