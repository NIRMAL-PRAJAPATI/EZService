// The customer's selected city and service address live in localStorage:
//   'city'      set on the home page (IP lookup) or by the location picker
//   'location'  "city, state, country, pincode" saved at login
// These helpers read them defensively and notify listeners on change.

const CITY_EVENT = 'ez:city-change';

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const clean = (value) =>
  (value || '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part && part !== 'undefined' && part !== 'null')
    .join(', ');

export const titleCase = (s = '') => s.replace(/\b\w/g, (c) => c.toUpperCase());

export const getCity = () => {
  const city = clean(read('city'));
  return city ? titleCase(city) : '';
};

export const setCity = (city) => {
  try {
    localStorage.setItem('city', city);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent(CITY_EVENT, { detail: city }));
};

export const onCityChange = (handler) => {
  const listener = (e) => handler(e.detail);
  window.addEventListener(CITY_EVENT, listener);
  return () => window.removeEventListener(CITY_EVENT, listener);
};

// Address captured at login ("Ahmedabad, Gujarat, India, 380001")
export const getSavedAddress = () => clean(read('location'));

// Addresses the customer typed during booking, kept on this device only.
const ADDR_KEY = 'ez_addresses';

export const getDeviceAddresses = () => {
  try {
    const list = JSON.parse(read(ADDR_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const saveDeviceAddress = (address) => {
  const list = getDeviceAddresses().filter((a) => a.text !== address.text);
  const next = [address, ...list].slice(0, 5);
  try {
    localStorage.setItem(ADDR_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
  return next;
};

export const POPULAR_CITIES = [
  'Ahmedabad',
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Surat',
];
