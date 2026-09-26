import { Link } from 'react-router-dom';
import { Loader2, Navigation, Zap, ZapOff } from 'lucide-react';
import { useAvailability } from './AvailabilityContext';

/**
 * Prominent availability control for instant service.
 * Uses the shared availability state from ProviderLayout.
 */
function InstantStatusToggle({ compact = false }) {
  const availability = useAvailability();
  if (!availability) return null;
  const { isOnline, loading, updating, error, toggleOnline, tripRunning } = availability;

  // On a trip: Instant Service is off and can't be switched on until the trip ends
  if (tripRunning && !isOnline) {
    if (compact) {
      return (
        <Link
          to="/provider/trips"
          className="inline-flex items-center gap-2 h-9 pl-2.5 pr-3 rounded-sm text-sm font-semibold border bg-amber-50 border-amber-200 text-amber-800"
          aria-label="You are on a trip, so Instant Service is off. Open running trip"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          On trip
        </Link>
      );
    }
    return (
      <section aria-labelledby="availability-title" className="rounded-md border border-amber-200 bg-amber-50 p-5">
        <p id="availability-title" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Your availability
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Navigation className="h-5 w-5 text-amber-700" aria-hidden="true" />
            <div>
              <p className="text-xl font-bold tracking-wide text-amber-800">ON A TRIP</p>
              <p className="text-sm text-amber-800">Instant Service is off until you finish your running trip.</p>
            </div>
          </div>
          <Link
            to="/provider/trips"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-sm text-sm font-semibold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 w-full sm:w-auto"
          >
            Open running trip
          </Link>
        </div>
      </section>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleOnline}
        disabled={loading || updating}
        className={`inline-flex items-center gap-2 h-9 pl-2.5 pr-3 rounded-sm text-sm font-semibold border transition-colors disabled:opacity-60 ${
          isOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-600'
        }`}
        aria-pressed={isOnline}
        aria-label={isOnline ? 'You are online. Tap to go offline' : 'You are offline. Tap to go online'}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} aria-hidden="true" />
        {loading ? '…' : isOnline ? 'Online' : 'Offline'}
      </button>
    );
  }

  return (
    <section
      aria-labelledby="availability-title"
      className={`rounded-md border p-5 ${isOnline ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}
    >
      <p id="availability-title" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Your availability
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`relative flex h-4 w-4`} aria-hidden="true">
            {isOnline && <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping" />}
            <span className={`relative inline-flex h-4 w-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
          </span>
          <div>
            <p className={`text-xl font-bold tracking-wide ${isOnline ? 'text-green-700' : 'text-gray-700'}`}>{loading ? 'Checking…' : isOnline ? 'ONLINE' : 'OFFLINE'}</p>
            <p className="text-sm text-gray-600">
              {isOnline ? 'You can receive instant service requests.' : "You won't receive instant requests."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleOnline}
          disabled={loading || updating}
          className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-sm text-sm font-semibold transition-colors disabled:opacity-60 w-full sm:w-auto ${
            isOnline ? 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50' : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : isOnline ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
    </section>
  );
}

export default InstantStatusToggle;
