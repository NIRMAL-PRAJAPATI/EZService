// Live location helpers (browser Geolocation API).
// Note: browsers only allow location on https:// sites (and on localhost).

export const getCurrentPosition = (options = {}) =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error("This device can't share its location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      (err) => {
        const msg =
          err.code === 1
            ? 'Location permission was blocked. Allow location for this site in your browser settings and try again.'
            : err.code === 3
              ? 'Getting your location took too long. Please try again.'
              : "We couldn't get your location. Please check that location is on.";
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000, ...options }
    );
  });

// Keeps calling onChange with the latest position. Returns a stop() function.
export const watchPosition = (onChange, onError) => {
  if (!('geolocation' in navigator)) return () => {};
  const id = navigator.geolocation.watchPosition(
    (pos) => onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
    (err) => onError?.(err),
    { enableHighAccuracy: true, maximumAge: 30000, timeout: 30000 }
  );
  return () => navigator.geolocation.clearWatch(id);
};

// Straight-line distance in km between two { lat, lng } points (haversine)
export const distanceKm = (a, b) => {
  if (!a || !b || a.lat == null || b.lat == null) return null;
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

export const formatKm = (km) => {
  if (km == null || Number.isNaN(km)) return null;
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
};

// Label stored as the "address" when the live location is the service location
export const liveLocationLabel = (c) => `Live location (${Number(c.lat).toFixed(5)}, ${Number(c.lng).toFixed(5)})`;
// Label stored when the customer chose the spot on the map instead
// (with the searched place name when there is one: "Pinned location: Manek Chowk, Ahmedabad (23.02319, 72.58862)")
export const pinnedLocationLabel = (c) =>
  `Pinned location${c.label ? `: ${c.label}` : ''} (${Number(c.lat).toFixed(5)}, ${Number(c.lng).toFixed(5)})`;

export const hasCoords = (o) => o && o.lat != null && o.lng != null && o.lat !== '' && o.lng !== '';

// Google Maps directions to exact coordinates, or to an address as a fallback
export const directionsUrl = (o) => {
  if (hasCoords(o)) return `https://www.google.com/maps/dir/?api=1&destination=${Number(o.lat)},${Number(o.lng)}`;
  const text = o?.location || o?.address;
  return text ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text)}` : null;
};

// Human text for a service location that may be a live location
export const locationText = (o, who = 'provider') => {
  const raw = o?.location || o?.address || '';
  if (/^Pinned location/i.test(raw)) {
    const place = raw.match(/^Pinned location: (.+) \([-\d.]+, [-\d.]+\)$/i)?.[1];
    if (place) return `${place} (pinned on map)`;
    return who === 'customer' ? 'Your pinned location (map)' : "Customer's pinned location (map)";
  }
  if (hasCoords(o) || /^Live location/i.test(raw)) return who === 'customer' ? 'Your live location' : "Customer's live location";
  return raw;
};
