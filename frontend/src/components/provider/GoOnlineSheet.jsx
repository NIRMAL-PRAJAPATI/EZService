import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, LocateFixed } from 'lucide-react';
import authApi from '../../config/auth-config';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import Switch from '../ui/Switch';
import { Skeleton } from '../ui/Skeleton';
import { getCategoryIcon } from '../../lib/categories';
import { formatPrice } from '../../lib/format';

export const SERVICES_CHANGED = 'ez:services-changed';
const isInstant = (s) => s.is_active !== false && s.instant_enabled !== false;

/**
 * Step before going online: the provider picks which services take Instant
 * Service requests (saved instantly), then confirms "Go online".
 */
export default function GoOnlineSheet({ open, onClose, onConfirm, confirming, locationError }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    authApi
      .get('/provider/services')
      .then((res) => setServices(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("We couldn't load your services."))
      .finally(() => setLoading(false));
  }, [open]);

  const toggle = (svc, patch) => {
    setError('');
    setServices((list) => list.map((s) => (s.id === svc.id ? { ...s, ...patch } : s)));
    authApi
      .patch(`/services/${svc.id}/flags`, patch)
      .then(() => window.dispatchEvent(new CustomEvent(SERVICES_CHANGED)))
      .catch(() => {
        setServices((list) => list.map((s) => (s.id === svc.id ? svc : s)));
        setError("Couldn't save that change. Please try again.");
      });
  };

  const instantCount = services.filter(isInstant).length;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Verify your services"
      footer={
        <div className="space-y-2">
          {!loading && instantCount === 0 && <p className="text-sm text-amber-700">Switch on at least one service for Instant Service to go online.</p>}
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" /> Your live location is shared while you're online, so customers' distance can be shown.
          </p>
          {locationError && (
            <p className="text-sm text-red-600" role="alert">
              {locationError}
            </p>
          )}
          <Button block size="lg" icon={Zap} variant="success" onClick={onConfirm} loading={confirming} disabled={loading || instantCount === 0}>
            Go online{instantCount ? ` · ${instantCount} service${instantCount === 1 ? '' : 's'}` : ''}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-gray-500 mb-3">Switch on the services you want live requests for. Changes apply instantly.</p>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : services.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-gray-500">You haven't added any services yet.</p>
          <Link to="/provider/services" onClick={onClose} className="mt-2 inline-block text-sm font-semibold text-indigo-600">
            Add a service
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-sm border border-gray-200">
          {services.map((svc) => {
            const Icon = getCategoryIcon(svc.category?.name || svc.name);
            const active = svc.is_active !== false;
            return (
              <li key={svc.id} className="flex items-center gap-3 p-3">
                <div className="flex flex-1 items-center gap-2.5 min-w-0">
                  <Icon className="h-5 w-5 shrink-0 text-indigo-500" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{svc.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {active ? `Instant ${formatPrice(svc.instant_visiting_charge ?? svc.visiting_charge)}` : 'Hidden service. Turn it on in My services first.'}
                    </p>
                  </div>
                </div>
                <Switch checked={active && svc.instant_enabled !== false} disabled={!active} onChange={(v) => toggle(svc, { instant_enabled: v })} label={`${svc.name} in Instant Service`} />
              </li>
            );
          })}
        </ul>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </BottomSheet>
  );
}
