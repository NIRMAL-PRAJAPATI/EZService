import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, Loader2, LocateFixed, MapPin, Search, X } from 'lucide-react';
import Button from '../ui/Button';
import { getCurrentPosition } from '../../lib/geo';
import { lockScroll } from '../../lib/scrollLock';

const INDIA = { lat: 22.9734, lng: 78.6569 };

// Place search (OpenStreetMap data via Photon, free and keyless), biased to the map area
const SEARCH_URL = 'https://photon.komoot.io/api/';

const placeLabel = (p = {}) => {
  const parts = [p.name, p.street && p.housenumber ? `${p.housenumber} ${p.street}` : p.street, p.locality || p.district, p.city || p.county, p.state];
  return [...new Set(parts.filter(Boolean))].join(', ');
};

const searchPlaces = (query, near, signal) => {
  const params = new URLSearchParams({ q: query, limit: '6', lang: 'en' });
  if (near) {
    params.set('lat', near.lat.toFixed(3));
    params.set('lon', near.lng.toFixed(3));
  }
  return fetch(`${SEARCH_URL}?${params}`, { signal })
    .then((r) => (r.ok ? r.json() : { features: [] }))
    .then((data) =>
      (data.features || []).map((f, i) => ({
        id: `${f.properties?.osm_type}${f.properties?.osm_id}-${i}`,
        name: f.properties?.name || placeLabel(f.properties).split(', ')[0],
        label: placeLabel(f.properties),
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }))
    );
};

/**
 * Full-screen map to choose the service location by moving the map under a
 * fixed centre pin (like ride-hailing apps). Returns { lat, lng } via onConfirm.
 * Uses OpenStreetMap tiles, so no API key is needed.
 */
export default function MapPicker({ open, initial, onClose, onConfirm }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[65] flex flex-col bg-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose location on map"
        >
          <PickerBody initial={initial} onClose={onClose} onConfirm={onConfirm} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function PickerBody({ initial, onClose, onConfirm }) {
  const mapEl = useRef(null);
  const map = useRef(null);
  const [center, setCenter] = useState(initial || INDIA);
  const [moving, setMoving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  // Name of the place picked from search (cleared when the customer drags the map away)
  const [place, setPlace] = useState(initial?.label || '');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => lockScroll(), []);

  // Search as the customer types (debounced; stale requests cancelled)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      setSearching(false);
      return undefined;
    }
    const ctrl = new AbortController();
    setSearching(true);
    const t = setTimeout(() => {
      const c = map.current?.getCenter();
      searchPlaces(q, c ? { lat: c.lat, lng: c.lng } : null, ctrl.signal)
        .then((list) => {
          setResults(list);
          setSearching(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setResults([]);
            setSearching(false);
          }
        });
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const choosePlace = (r) => {
    setPlace(r.label || r.name);
    setQuery('');
    setResults([]);
    setSearchOpen(false);
    map.current?.flyTo([r.lat, r.lng], 17, { duration: 0.8 });
  };

  useEffect(() => {
    const start = initial || INDIA;
    const m = L.map(mapEl.current, { zoomControl: false, attributionControl: true }).setView([start.lat, start.lng], initial ? 17 : 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(m);
    L.control.zoom({ position: 'bottomright' }).addTo(m);
    m.on('movestart', () => setMoving(true));
    // Moving the pin by hand means it's no longer exactly the searched place
    m.on('dragstart', () => {
      setPlace('');
      setSearchOpen(false);
    });
    m.on('click', () => setSearchOpen(false));
    m.on('moveend', () => {
      const c = m.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
      setMoving(false);
    });
    map.current = m;
    // The container animates in; make sure Leaflet measures its final size
    const t = setTimeout(() => m.invalidateSize(), 250);

    // No starting point: try to open the map where the customer is
    if (!initial) {
      getCurrentPosition()
        .then((c) => map.current === m && m.setView([c.lat, c.lng], 17))
        .catch(() => {});
    }
    return () => {
      clearTimeout(t);
      m.remove();
      map.current = null;
    };
    // initial is only used for the first view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const locateMe = () => {
    setLocating(true);
    setError('');
    getCurrentPosition()
      .then((c) => {
        setPlace('');
        map.current?.setView([c.lat, c.lng], 17);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLocating(false));
  };

  const zoom = map.current?.getZoom?.() ?? 0;

  return (
    <>
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <button type="button" onClick={onClose} className="h-10 w-10 -ml-2 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100" aria-label="Back">
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <p className="font-bold text-gray-900">Choose service location</p>
          <p className="text-xs text-gray-500">Move the map to put the pin on the exact spot</p>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div ref={mapEl} className="absolute inset-0 z-0" />
        {/* Fixed centre pin: the map moves under it */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-full" aria-hidden="true">
          <motion.div animate={{ y: moving ? -10 : 0 }} transition={{ duration: 0.15 }}>
            <MapPin className="h-11 w-11 fill-indigo-500 text-white drop-shadow-lg" strokeWidth={1.5} />
          </motion.div>
          <span className="mx-auto -mt-1 block h-1.5 w-3 rounded-full bg-black/30" />
        </div>
        {/* Search a place, like in Google Maps */}
        <div className="absolute inset-x-3 top-3 z-[600]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              enterKeyHint="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && results[0]) {
                  e.preventDefault();
                  choosePlace(results[0]);
                }
                if (e.key === 'Escape') setSearchOpen(false);
              }}
              placeholder="Search area, street or landmark"
              aria-label="Search a place"
              autoComplete="off"
              className="w-full h-12 rounded-md border border-gray-200 bg-white pl-11 pr-10 text-base text-gray-900 shadow-md focus:border-indigo-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          {searchOpen && query.trim().length >= 3 && (
            <ul className="mt-1 max-h-[45vh] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg divide-y divide-gray-100" role="listbox" aria-label="Places">
              {searching && results.length === 0 && (
                <li className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Searching…
                </li>
              )}
              {!searching && results.length === 0 && <li className="px-4 py-3 text-sm text-gray-500">No places found. Try another name, or move the map.</li>}
              {results.map((r) => (
                <li key={r.id} role="option" aria-selected="false">
                  <button type="button" onClick={() => choosePlace(r)} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-indigo-50/60">
                    <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-gray-900">{r.name}</span>
                      <span className="block truncate text-xs text-gray-500">{r.label}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={locateMe}
          disabled={locating}
          className="absolute right-3 top-[4.5rem] z-[500] inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-md disabled:opacity-60"
        >
          <LocateFixed className={`h-4 w-4 ${locating ? 'animate-pulse' : ''}`} aria-hidden="true" /> My location
        </button>
      </div>

      <div className="border-t border-gray-200 bg-white px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 mt-0.5 text-indigo-500 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{place || 'Pinned location'}</p>
            <p className="text-xs text-gray-500">
              {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
              {zoom && zoom < 14 ? ' · zoom in to place the pin exactly' : ''}
            </p>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button block size="lg" disabled={moving} onClick={() => onConfirm({ lat: center.lat, lng: center.lng, label: place || '' })}>
          Confirm this location
        </Button>
      </div>
    </>
  );
}
