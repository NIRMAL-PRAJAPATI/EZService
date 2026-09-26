import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquarePlus, ImagePlus, X, MessagesSquare, Trophy, LifeBuoy, ChevronRight } from 'lucide-react';
import UserReview from '../components/Explore/UserReview';
import UserComp from '../components/Explore/UserComp';
import ProviderSelect from '../components/Explore/ProviderSelect';
import ProviderCard from '../components/Service/ProviderCard';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import OutlinedField from '../components/ui/OutlinedField';
import Tabs from '../components/ui/Tabs';
import { StarInput } from '../components/ui/Rating';
import { CardListSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState, InlineError } from '../components/ui/States';
import api from '../config/axios-config';
import authApi from '../config/auth-config';
import { getAuthUser } from '../lib/auth';

const PAGE_SIZE = 12;
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'comment', label: 'Reviews' },
  { id: 'complaint', label: 'Complaints' },
];

const Explore = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');
  const [topServices, setTopServices] = useState([]);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('comment');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [commentData, setCommentData] = useState({ message: '', hashtags: [], rating: 0 });
  const [complaintData, setComplaintData] = useState({ message: '', subject: '' });
  const [hashtagInput, setHashtagInput] = useState('');
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState('');
  const [posted, setPosted] = useState('');

  const loadPosts = (pageNum, append) => {
    const setBusy = append ? setLoadingMore : setLoading;
    setBusy(true);
    setError(false);
    api
      .get(`/explore-posts?limit=${PAGE_SIZE}&page=${pageNum}`)
      .then((response) => {
        setPosts((prev) => (append ? [...prev, ...response.data] : response.data));
        setHasMore(response.data.length === PAGE_SIZE);
        setPage(pageNum);
      })
      .catch(() => setError(true))
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    loadPosts(1, false);
    api
      .get('/services/?limit=30')
      .then((res) => {
        const rated = (res.data || []).filter((s) => Number(s.average_rating) > 0).sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
        setTopServices(rated.slice(0, 6));
      })
      .catch(() => setTopServices([]));
  }, []);

  const visiblePosts = useMemo(() => (filter === 'all' ? posts : posts.filter((p) => p.type === filter)), [posts, filter]);

  const isValidHashtag = (tag) => /^[a-zA-Z0-9]+$/.test(tag);
  const handleAddHashtag = () => {
    const trimmed = hashtagInput.trim().replace(/^#/, '');
    if (trimmed && isValidHashtag(trimmed) && !commentData.hashtags.includes(`#${trimmed}`)) {
      setCommentData((prev) => ({ ...prev, hashtags: [...prev.hashtags, `#${trimmed}`] }));
      setHashtagInput('');
    }
  };
  const handleRemoveHashtag = (tag) => setCommentData((prev) => ({ ...prev, hashtags: prev.hashtags.filter((t) => t !== tag) }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setCommentData({ message: '', hashtags: [], rating: 0 });
    setComplaintData({ message: '', subject: '' });
    setHashtagInput('');
    setSelectedProvider(null);
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  const openComposer = () => {
    if (getAuthUser()?.role !== 'customer') {
      navigate('/login', { state: { from: '/explore' } });
      return;
    }
    setPosted('');
    setOpen(true);
  };

  const message = activeTab === 'comment' ? commentData.message : complaintData.message;
  const isMessageValid = message.trim().length >= 5 && message.trim().length <= 50;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedProvider) return setFormError('Please choose the provider this is about.');
    if (!isMessageValid) return setFormError('Your message should be 5 to 50 characters.');

    const formData = new FormData();
    formData.append('provider_id', selectedProvider.id);
    formData.append('type', activeTab);
    if (imageFile) formData.append('image', imageFile);
    if (activeTab === 'comment') {
      formData.append('message', commentData.message);
      formData.append('rating', commentData.rating || '');
      formData.append('hashtags', JSON.stringify(commentData.hashtags));
    } else {
      formData.append('subject', complaintData.subject);
      formData.append('message', complaintData.message);
    }

    setPosting(true);
    authApi
      .post('/explore-posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => {
        setPosts((prev) => [response.data, ...prev]);
        setOpen(false);
        setPosted(activeTab === 'comment' ? 'Your review is posted.' : 'Your complaint is posted.');
        resetForm();
      })
      .catch((err) => setFormError(err.response?.data?.message || "We couldn't post this. Please try again."))
      .finally(() => setPosting(false));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900">Explore</h1>
          <p className="text-sm text-gray-500">What customers are saying about local professionals.</p>
        </div>
        <div className="hidden sm:block">
          <Button icon={MessageSquarePlus} onClick={openComposer}>
            Share feedback
          </Button>
        </div>
      </div>

      {posted && (
        <p className="mt-4 rounded-sm bg-green-50 px-4 py-3 text-sm font-medium text-green-800" role="status">
          {posted}
        </p>
      )}

      {/* Quick links to secondary sections (kept out of the main navigation) */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/rankings" className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 hover:border-indigo-300">
          <span className="h-10 w-10 shrink-0 rounded-sm bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-gray-900 leading-tight">Top-rated services</span>
        </Link>
        <Link to="/complaint" className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3 hover:border-indigo-300">
          <span className="h-10 w-10 shrink-0 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <LifeBuoy className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-gray-900 leading-tight">Help with a booking</span>
        </Link>
      </div>

      {topServices.length > 0 && (
        <section className="mt-8" aria-labelledby="trending-title">
          <div className="flex items-center justify-between mb-3">
            <h2 id="trending-title" className="text-lg font-bold tracking-wide text-gray-900">
              Highly rated professionals
            </h2>
            <Link to="/rankings" className="inline-flex items-center text-sm font-semibold text-indigo-600">
              See all <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3">
            {topServices.slice(0, 3).map((s) => (
              <div key={s.id} className="w-[280px] shrink-0 md:w-auto">
                <ProviderCard service={s} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8" aria-labelledby="feed-title">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 id="feed-title" className="text-lg font-bold tracking-wide text-gray-900">
            Customer feedback
          </h2>
        </div>

        <Tabs className="mb-4" label="Filter feedback" value={filter} onChange={setFilter} tabs={FILTERS} />
        {loading ? (
          <CardListSkeleton count={3} />
        ) : error ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <ErrorState description="We couldn't load the feed. Please try again." onRetry={() => loadPosts(1, false)} />
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <EmptyState icon={MessagesSquare} title="Nothing here yet" description="Be the first to share your experience with a professional." actionLabel="Share feedback" onAction={openComposer} />
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
            {visiblePosts.map((post) => (post.type === 'comment' ? <UserReview key={`comment-${post.id}`} post={post} /> : <UserComp key={`complaint-${post.id}`} post={post} />))}
          </div>
        )}

        {!loading && !error && hasMore && (
          <div className="mt-5 flex justify-center">
            <Button variant="secondary" onClick={() => loadPosts(page + 1, true)} loading={loadingMore}>
              Load more
            </Button>
          </div>
        )}
      </section>

      {/* Floating action on phones (above the bottom navigation) */}
      <button
        type="button"
        onClick={openComposer}
        className="sm:hidden fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] z-30 h-14 w-14 rounded-full bg-indigo-500 text-white shadow-lg flex items-center justify-center"
        aria-label="Share feedback"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Share feedback"
        footer={
          <Button type="submit" form="explore-form" block loading={posting}>
            {activeTab === 'comment' ? 'Post review' : 'Post complaint'}
          </Button>
        }
      >
        <div className="grid grid-cols-2 rounded-sm bg-gray-100 p-1 mb-5" role="tablist">
          {[
            ['comment', 'Review'],
            ['complaint', 'Complaint'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`h-10 rounded-sm text-sm font-semibold ${activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form id="explore-form" onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">Provider</p>
            <ProviderSelect value={selectedProvider} onChange={setSelectedProvider} />
          </div>

          {activeTab === 'comment' ? (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Rating</p>
                <StarInput value={commentData.rating} onChange={(n) => setCommentData((p) => ({ ...p, rating: n }))} size="h-7 w-7" />
              </div>
              <OutlinedField
                as="textarea"
                rows={3}
                label="Your review"
                name="message"
                value={commentData.message}
                onChange={(e) => setCommentData((p) => ({ ...p, message: e.target.value }))}
                hint={`${commentData.message.trim().length}/50 characters`}
              />
              <div>
                <div className="flex gap-2">
                  <OutlinedField
                    label="Hashtag"
                    name="hashtag"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHashtag();
                      }
                    }}
                    placeholder="e.g. quickservice"
                    className="flex-1"
                  />
                  <Button variant="secondary" onClick={handleAddHashtag} className="h-[50px]">
                    Add
                  </Button>
                </div>
                {commentData.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commentData.hashtags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-sm bg-indigo-50 pl-2.5 pr-1 py-1 text-xs font-medium text-indigo-700">
                        {tag}
                        <button type="button" onClick={() => handleRemoveHashtag(tag)} className="h-5 w-5 rounded-full hover:bg-indigo-100 flex items-center justify-center" aria-label={`Remove ${tag}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <OutlinedField label="Subject" name="subject" value={complaintData.subject} onChange={(e) => setComplaintData((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g. Late arrival" />
              <OutlinedField
                as="textarea"
                rows={3}
                label="What happened?"
                name="complaint-message"
                value={complaintData.message}
                onChange={(e) => setComplaintData((p) => ({ ...p, message: e.target.value }))}
                hint={`${complaintData.message.trim().length}/50 characters. For a booking issue, use Help & complaints instead.`}
              />
            </>
          )}

          <div>
            <label className="flex items-center gap-2 w-full h-12 rounded-sm border border-dashed border-gray-300 px-3 text-sm text-gray-600 cursor-pointer hover:border-indigo-400 hover:text-indigo-600">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {imageFile ? imageFile.name : 'Add a photo (optional)'}
              <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
            </label>
            {imagePreview && (
              <div className="relative mt-2 w-fit">
                <img src={imagePreview} alt="Selected" className="h-24 rounded-sm object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-black/70 text-white flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <InlineError>{formError}</InlineError>
        </form>
      </BottomSheet>
    </div>
  );
};

export default Explore;
