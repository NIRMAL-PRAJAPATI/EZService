import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, SearchX, Zap } from 'lucide-react';
import api from '../config/axios-config';
import SearchBar from '../components/ui/SearchBar';
import CategoryGrid from '../components/Service/CategoryGrid';
import ProviderCard from '../components/Service/ProviderCard';
import BottomSheet from '../components/ui/BottomSheet';
import Button from '../components/ui/Button';
import { GridSkeleton } from '../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../components/ui/States';
import { getCity } from '../lib/location';

const PAGE = 12;
const SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'rating', label: 'Rating' },
  { id: 'price', label: 'Price: low to high' },
];

function ServicesPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('recommended');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [myCityOnly, setMyCityOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE);
  const city = getCity();

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([api.get('/category/'), category ? api.get(`/services/${category}/category`) : api.get('/services/?limit=100')])
      .then(([cats, svc]) => {
        setCategories(cats.data || []);
        setServices(svc.data || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    setVisible(PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const activeCategory = categories.find((c) => String(c.id) === String(category));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = services.filter((s) => {
      if (verifiedOnly && !s.badge_status) return false;
      if (myCityOnly && city && (s.city || '').toLowerCase() !== city.toLowerCase()) return false;
      if (!q) return true;
      return [s.name, s.ProviderInfo?.name, s.category?.name, s.city, s.description].some((v) => (v || '').toLowerCase().includes(q));
    });
    if (sort === 'rating') list = [...list].sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0));
    if (sort === 'price') list = [...list].sort((a, b) => (Number(a.visiting_charge) || 0) - (Number(b.visiting_charge) || 0));
    return list;
  }, [services, query, sort, verifiedOnly, myCityOnly, city]);

  const activeFilterCount = (verifiedOnly ? 1 : 0) + (myCityOnly ? 1 : 0);

  const onSearch = (value) => {
    const q = (value || '').trim();
    setSearchParams(q ? { q } : {});
  };

  const selectCategory = (c) => {
    if (String(c.id) === String(category)) navigate('/services');
    else navigate(`/services/${c.id}`);
  };

  const title = activeCategory?.name || 'All services';

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-4 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide text-gray-900">{title}</h1>
        {activeCategory?.description && <p className="hidden md:block mt-1 text-gray-500">{activeCategory.description}</p>}

        <div className="mt-3 md:mt-5 sticky top-0 md:top-16 z-20 -mx-4 px-4 md:mx-0 md:px-0 pt-1 pb-3 bg-white">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setVisible(PAGE);
            }}
            onSubmit={onSearch}
            placeholder={activeCategory ? `Search in ${activeCategory.name}` : 'Search services or professionals'}
          />
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sort === s.id}
                onClick={() => setSort(s.id)}
                className={`shrink-0 h-9 px-3.5 rounded-sm border text-sm font-medium ${
                  sort === s.id ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className={`shrink-0 h-9 px-3.5 rounded-sm border text-sm font-medium inline-flex items-center gap-1.5 ${
                activeFilterCount ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters{activeFilterCount ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-4">
            <CategoryGrid categories={categories} layout="chips" activeId={category} onSelect={selectCategory} />
          </div>
        )}

        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">{loading ? 'Loading professionals…' : `${results.length} professional${results.length === 1 ? '' : 's'}`}</h2>
          {activeCategory && (
            <Button variant="ghost" size="sm" icon={Zap} to={`/instant-service?category=${activeCategory.id}`}>
              Need it now?
            </Button>
          )}
        </div>

        {loading ? (
          <GridSkeleton count={6} />
        ) : error ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <ErrorState description="We couldn't load professionals. Please try again." onRetry={load} />
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <EmptyState
              icon={SearchX}
              title="No professionals found"
              description={query || activeFilterCount ? 'Try a different search or clear your filters.' : 'Nobody offers this service yet. Try instant service and we will ask providers nearby.'}
              actionLabel={query || activeFilterCount ? 'Clear search & filters' : 'Get Instant Service'}
              actionTo={query || activeFilterCount ? undefined : '/instant-service'}
              onAction={
                query || activeFilterCount
                  ? () => {
                      setQuery('');
                      setVerifiedOnly(false);
                      setMyCityOnly(false);
                      setSearchParams({});
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <>
            {/* Phones: compact rows. Larger screens: cards. */}
            <div className="sm:hidden -mx-4 border-y border-gray-200 divide-y divide-gray-200">
              {results.slice(0, visible).map((s) => (
                <ProviderCard key={s.id} service={s} layout="row" />
              ))}
            </div>
            <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-3">
              {results.slice(0, visible).map((s) => (
                <ProviderCard key={s.id} service={s} />
              ))}
            </div>
            {visible < results.length && (
              <div className="mt-5 flex justify-center">
                <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>
                  Show more
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <BottomSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setVerifiedOnly(false);
                setMyCityOnly(false);
              }}
            >
              Clear
            </Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show {results.length} result{results.length === 1 ? '' : 's'}
            </Button>
          </div>
        }
      >
        <div className="divide-y divide-gray-100">
          <ToggleRow label="Verified professionals only" description="Providers with a verified badge" checked={verifiedOnly} onChange={setVerifiedOnly} />
          <ToggleRow
            label={city ? `Only in ${city}` : 'Only in my city'}
            description={city ? 'Hide professionals from other cities' : 'Set your city from the location picker first'}
            checked={myCityOnly}
            onChange={setMyCityOnly}
            disabled={!city}
          />
        </div>
      </BottomSheet>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, disabled }) {
  return (
    <label className={`flex items-center justify-between gap-4 py-4 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <span>
        <span className="block font-medium text-gray-900">{label}</span>
        <span className="block text-sm text-gray-500">{description}</span>
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

export default ServicesPage;
