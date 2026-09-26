import { Loader2, Zap, ZapOff } from 'lucide-react';
import { useAvailability } from './AvailabilityContext';

/**
 * Prominent availability control for instant service.
 * Uses the shared availability state from ProviderLayout.
 */
function InstantStatusToggle({ compact = false }) {
  const availability = useAvailability();
  if (!availability) return null;
  const { isOnline, loading, updating, error, setOnline } = availability;

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setOnline(!isOnline)}
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
          onClick={() => setOnline(!isOnline)}
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
