import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, LogIn, MessageSquareWarning } from 'lucide-react';
import authApi from '../../config/auth-config';
import OutlinedField from '../ui/OutlinedField';
import Button from '../ui/Button';
import StatusBadge, { COMPLAINT_STATUS } from '../ui/StatusBadge';
import { EmptyState, InlineError } from '../ui/States';
import { CardListSkeleton } from '../ui/Skeleton';
import { getAuthUser } from '../../lib/auth';
import { formatDate, formatDateTime } from '../../lib/format';

const REASONS = ['Late arrival', 'Work quality', 'Overcharged', 'Rude behaviour', 'Did not show up', 'Something else'];

/**
 * Customer help & complaints: file a complaint about one of your bookings
 * (saved to the backend) and follow the status of earlier complaints.
 */
export default function ComplaintForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = getAuthUser();

  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(searchParams.get('order') || '');
  const [reason, setReason] = useState('');
  const [issue, setIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const loadComplaints = () =>
    authApi
      .get('/complaints/customer')
      .then((res) => setComplaints(Array.isArray(res.data) ? res.data : []))
      .catch(() => setComplaints([]));

  useEffect(() => {
    if (user?.role !== 'customer') {
      setLoading(false);
      return;
    }
    Promise.all([
      authApi.get('/orders/customer/').then((res) => setOrders(Array.isArray(res.data) ? res.data : [])).catch(() => setOrders([])),
      loadComplaints(),
    ]).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!orderId) return setError('Please choose the booking this is about.');
    if (!reason) return setError('Please choose a reason.');
    if (issue.trim().length < 10) return setError('Please describe what happened (at least 10 characters).');

    setSubmitting(true);
    authApi
      .post('/complaints', { order_id: orderId, subject: reason, issue })
      .then(() => {
        setSuccess(true);
        setReason('');
        setIssue('');
        loadComplaints();
      })
      .catch((err) => setError(err.response?.data?.message || "We couldn't submit your complaint. Please try again."))
      .finally(() => setSubmitting(false));
  };

  if (user?.role !== 'customer') {
    return (
      <EmptyState
        icon={LogIn}
        title="Log in to get help"
        description="Log in to report a problem with one of your bookings."
        actionLabel="Log in"
        onAction={() => navigate('/login', { state: { from: '/complaint' } })}
      />
    );
  }

  if (loading) return <CardListSkeleton count={2} />;

  return (
    <div className="space-y-6">
      {success ? (
        <section className="rounded-md border border-green-200 bg-green-50 p-5 text-center" role="status">
          <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" aria-hidden="true" />
          <h2 className="mt-2 text-lg font-bold tracking-wide text-gray-900">Complaint submitted</h2>
          <p className="text-sm text-gray-600">The provider has been notified. You can follow its status below.</p>
          <Button variant="secondary" className="mt-4" onClick={() => setSuccess(false)}>
            Report another problem
          </Button>
        </section>
      ) : orders.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white">
          <EmptyState icon={MessageSquareWarning} title="No bookings yet" description="You can report a problem after you have booked a service." actionLabel="Browse services" actionTo="/services" />
        </div>
      ) : (
        <form onSubmit={submit} className="rounded-md border border-gray-200 bg-white p-5 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">Which booking is this about?</h2>
            <OutlinedField as="select" label="Booking" name="order" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              <option value="">Choose a booking</option>
              {orders.map((o) => (
                <option key={o.order_id} value={o.order_id}>
                  {o.Service?.name || 'Service'} · {o.ProviderInfo?.name || 'Provider'} · {formatDateTime(o.date || o.created)}
                </option>
              ))}
            </OutlinedField>
          </div>

          <fieldset>
            <legend className="text-base font-semibold text-gray-900 mb-3">What went wrong?</legend>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={reason === r}
                  onClick={() => setReason(r)}
                  className={`h-10 px-4 rounded-sm border text-sm font-medium ${reason === r ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          <OutlinedField as="textarea" rows={4} label="Describe what happened" name="issue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Tell us the details so the provider can resolve it." />

          <InlineError>{error}</InlineError>
          <Button type="submit" block loading={submitting}>
            Submit complaint
          </Button>
        </form>
      )}

      <section aria-labelledby="my-complaints">
        <h2 id="my-complaints" className="text-lg font-bold tracking-wide text-gray-900 mb-3">
          My complaints
        </h2>
        {complaints.length === 0 ? (
          <p className="rounded-md border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-500">You haven't reported any problems.</p>
        ) : (
          <ul className="space-y-3">
            {complaints.map((c) => (
              <li key={c.id} className="rounded-md border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{c.subject || 'Complaint'}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {c.Service?.name || 'Service'} · {c.ProviderInfo?.name || 'Provider'}
                    </p>
                  </div>
                  <StatusBadge status={c.status} map={COMPLAINT_STATUS} />
                </div>
                <p className="mt-2 text-sm text-gray-700">{c.issue}</p>
                {c.created && <p className="mt-2 text-xs text-gray-400">Filed {formatDate(c.created)}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
