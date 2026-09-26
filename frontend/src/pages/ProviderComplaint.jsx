import { useEffect, useMemo, useState } from 'react';
import { MessageSquareWarning, UserRound, Wrench, Calendar } from 'lucide-react';
import authApi from '../config/auth-config';
import { ProviderPage } from '../components/layout/ProviderLayout';
import StatusBadge, { COMPLAINT_STATUS } from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import { CardListSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { formatDate } from '../lib/format';

const TABS = [
  { id: 'OPEN', label: 'Open' },
  { id: 'IN_PROGRESS', label: 'In progress' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'ALL', label: 'All' },
];

function ComplaintItem({ complaint, onStatusUpdate }) {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const update = (status) => {
    setBusy(status);
    setError('');
    authApi
      .put(`/complaints/${complaint.id}/status`, { status })
      .then(() => onStatusUpdate(complaint.id, status))
      .catch(() => setError("Couldn't update this complaint. Please try again."))
      .finally(() => setBusy(''));
  };

  return (
    <article className="rounded-md border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">Customer complaint</p>
          <h3 className="font-semibold text-gray-900">{complaint.subject || 'Complaint'}</h3>
        </div>
        <StatusBadge status={complaint.status} map={COMPLAINT_STATUS} />
      </div>
      <p className="mt-2 text-sm text-gray-700">{complaint.issue}</p>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        <li className="inline-flex items-center gap-1">
          <UserRound className="h-3.5 w-3.5" aria-hidden="true" /> {complaint.CustomerInfo?.name || 'Customer'}
        </li>
        {complaint.Service?.name && (
          <li className="inline-flex items-center gap-1">
            <Wrench className="h-3.5 w-3.5" aria-hidden="true" /> {complaint.Service.name}
          </li>
        )}
        {complaint.created && (
          <li className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(complaint.created)}
          </li>
        )}
      </ul>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {(complaint.status === 'OPEN' || complaint.status === 'IN_PROGRESS') && (
        <div className="mt-4 flex gap-2">
          {complaint.status === 'OPEN' && (
            <Button variant="secondary" className="flex-1" onClick={() => update('IN_PROGRESS')} loading={busy === 'IN_PROGRESS'} disabled={!!busy}>
              Start working on it
            </Button>
          )}
          <Button variant="success" className="flex-1" onClick={() => update('RESOLVED')} loading={busy === 'RESOLVED'} disabled={!!busy}>
            Mark resolved
          </Button>
        </div>
      )}
    </article>
  );
}

function ProviderComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [tab, setTab] = useState('OPEN');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchComplaints = () => {
    setLoading(true);
    setError(false);
    authApi
      .get('/complaints/provider')
      .then((res) => setComplaints(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(fetchComplaints, []);

  const counts = useMemo(() => {
    const c = { ALL: complaints.length };
    complaints.forEach((x) => (c[x.status] = (c[x.status] || 0) + 1));
    return c;
  }, [complaints]);

  const list = tab === 'ALL' ? complaints : complaints.filter((c) => c.status === tab);
  const handleStatusUpdate = (id, status) => setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  return (
    <ProviderPage title="Complaints" subtitle="Resolve customer issues quickly to keep your rating high.">
      <Tabs
        className="mb-4"
        label="Complaint status"
        value={tab}
        onChange={setTab}
        tabs={TABS.map((t) => ({ id: t.id, label: t.label, count: counts[t.id] || 0 }))}
      />

      {loading ? (
        <CardListSkeleton count={3} />
      ) : error ? (
        <div className="rounded-md border border-gray-200 bg-white">
          <ErrorState description="We couldn't load complaints." onRetry={fetchComplaints} />
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white">
          <EmptyState icon={MessageSquareWarning} title={tab === 'OPEN' ? 'No open complaints' : 'Nothing here'} description={tab === 'OPEN' ? 'Great work. Customer complaints will appear here.' : 'Complaints with this status will appear here.'} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {list.map((c) => (
            <ComplaintItem key={c.id} complaint={c} onStatusUpdate={handleStatusUpdate} />
          ))}
        </div>
      )}
    </ProviderPage>
  );
}

export default ProviderComplaint;
