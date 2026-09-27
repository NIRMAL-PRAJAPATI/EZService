import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import authApi from '../../config/auth-config';
import GoOnlineSheet from './GoOnlineSheet';
import TripDoneOverlay from './TripDoneOverlay';
import { getCurrentPosition, watchPosition } from '../../lib/geo';

// Shares the provider's instant-service availability (is_online) and live
// location between the header pill, the dashboard card and the instant-requests page.
const AvailabilityContext = createContext(null);

const LOCATION_PUSH_MS = 60000; // send the live location to the server at most once a minute
const STATUS_REFRESH_MS = 60000;

// Fired by the trip controls whenever a trip starts or ends
export const TRIP_CHANGED_EVENT = 'ez:trip-changed';
export const TRIP_RUNNING_MESSAGE = 'You have a running trip. Finish it before going online for Instant Service.';

export function AvailabilityProvider({ children }) {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [position, setPosition] = useState(null);
  // One job at a time: Instant Service stays off while a trip is running
  const [tripRunning, setTripRunning] = useState(false);
  const lastPush = useRef(0);

  const refresh = useCallback(
    () =>
      authApi
        .get('/provider/online-status')
        .then((res) => {
          setIsOnline(!!res.data?.isOnline);
          setTripRunning(!!res.data?.tripRunning);
          if (!res.data?.tripRunning) setError((e) => (e === TRIP_RUNNING_MESSAGE ? '' : e));
        }),
    []
  );

  useEffect(() => {
    refresh()
      .catch(() => setError("We couldn't load your availability."))
      .finally(() => setLoading(false));
  }, [refresh]);

  // Starting a trip switches Instant Service off on the server; pick that up right away,
  // and check now and then in case it changed on another device.
  useEffect(() => {
    const onTrip = () => refresh().catch(() => {});
    window.addEventListener(TRIP_CHANGED_EVENT, onTrip);
    const t = setInterval(onTrip, STATUS_REFRESH_MS);
    return () => {
      window.removeEventListener(TRIP_CHANGED_EVENT, onTrip);
      clearInterval(t);
    };
  }, [refresh]);

  // While online, keep the live location fresh (on screen + on the server)
  useEffect(() => {
    if (!isOnline) return undefined;
    return watchPosition((pos) => {
      setPosition(pos);
      if (Date.now() - lastPush.current > LOCATION_PUSH_MS) {
        lastPush.current = Date.now();
        authApi.patch('/provider/location', { lat: pos.lat, lng: pos.lng }).catch(() => {});
      }
    });
  }, [isOnline]);

  const setOnline = useCallback((next, coords) => {
    setError('');
    setIsOnline(next); // instant feedback
    setUpdating(true);
    return authApi
      .patch('/provider/online-status', { isOnline: next, ...(coords && { lat: coords.lat, lng: coords.lng }) })
      .then(() => {
        if (coords) {
          setPosition(coords);
          lastPush.current = Date.now();
        }
      })
      .catch((err) => {
        setIsOnline(!next); // revert on failure
        setError(err.response?.data?.message || "Couldn't update your availability. Please try again.");
        throw err;
      })
      .finally(() => setUpdating(false));
  }, []);

  // Going online first asks the provider to verify their services and share location
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);
  const requestOnline = useCallback(() => {
    if (tripRunning) {
      setError(TRIP_RUNNING_MESSAGE);
      return;
    }
    setLocationError('');
    setVerifyOpen(true);
  }, [tripRunning]);
  const toggleOnline = useCallback(() => (isOnline ? setOnline(false).catch(() => {}) : requestOnline()), [isOnline, setOnline, requestOnline]);

  const confirmOnline = () => {
    setLocationError('');
    setLocating(true);
    getCurrentPosition()
      .then((coords) => setOnline(true, coords).then(() => setVerifyOpen(false)))
      .catch((err) => {
        if (err.response?.data?.code === 'TRIP_RUNNING') {
          setTripRunning(true);
          setVerifyOpen(false);
          setError(TRIP_RUNNING_MESSAGE);
          return;
        }
        setLocationError(err.response?.data?.message || err.message || "Couldn't go online.");
      })
      .finally(() => setLocating(false));
  };

  return (
    <AvailabilityContext.Provider value={{ isOnline, loading, updating, error, setOnline, requestOnline, toggleOnline, position, tripRunning, refresh }}>
      {children}
      <TripDoneOverlay />
      <GoOnlineSheet open={verifyOpen} onClose={() => setVerifyOpen(false)} onConfirm={confirmOnline} confirming={updating || locating} locationError={locationError} />
    </AvailabilityContext.Provider>
  );
}

export const useAvailability = () => useContext(AvailabilityContext);
