import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import authApi from '../../config/auth-config';

// Shares the provider's instant-service availability (is_online) between the
// header pill, the dashboard card and the instant-requests page.
const AvailabilityContext = createContext(null);

export function AvailabilityProvider({ children }) {
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    authApi
      .get('/provider/online-status')
      .then((res) => setIsOnline(!!res.data?.isOnline))
      .catch(() => setError("We couldn't load your availability."))
      .finally(() => setLoading(false));
  }, []);

  const setOnline = useCallback((next) => {
    setError('');
    setIsOnline(next); // instant feedback
    setUpdating(true);
    return authApi
      .patch('/provider/online-status', { isOnline: next })
      .catch(() => {
        setIsOnline(!next); // revert on failure
        setError("Couldn't update your availability. Please try again.");
      })
      .finally(() => setUpdating(false));
  }, []);

  return <AvailabilityContext.Provider value={{ isOnline, loading, updating, error, setOnline }}>{children}</AvailabilityContext.Provider>;
}

export const useAvailability = () => useContext(AvailabilityContext);
