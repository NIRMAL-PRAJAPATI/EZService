import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ChevronRight, Search, CalendarCheck, ShieldCheck, Briefcase } from 'lucide-react';
import api from '../config/axios-config';
import SearchBar from '../components/ui/SearchBar';
import CategoryGrid from '../components/Service/CategoryGrid';
import ProviderCard from '../components/Service/ProviderCard';
import { Skeleton, GridSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import { getCity, setCity, onCityChange } from '../lib/location';
import { getAuthUser } from '../lib/auth';

function UserHome() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [city, setCityState] = useState(getCity());
  const loggedIn = !!getAuthUser();

  const load = () => {
    setLoading(true);
    setError(false);
    Promise.all([api.get('/category/names'), api.get('/services/?limit=30')])
      .then(([cats, svc]) => {
        setCategories(cats.data || []);
        setServices(svc.data || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Detect the city once (no blocking prompt if detection fails).
    if (!getCity()) {
      api
        .get('/user/city/get')
        .then((res) => {
          if (res.data && typeof res.data === 'string') {
            setCity(res.data);
          }
        })
        .catch(() => {});
    }
    load();
    return onCityChange((c) => setCityState(c || ''));
  }, []);

  // Services in the selected city first, then the best rated elsewhere.
  const { local, topRated } = useMemo(() => {
    const byRating = [...services].sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0));
    const inCity = city ? byRating.filter((s) => (s.city || '').toLowerCase() === city.toLowerCase()) : [];
    return { local: inCity.slice(0, 6), topRated: byRating.slice(0, 6) };
  }, [services, city]);

  const handleSearch = (value) => {
    const q = (value || '').trim();
    if (!q) return;
    const match = categories.find((c) => c.name.toLowerCase().includes(q.toLowerCase()));
    navigate(match ? `/services/${match.id}` : `/services?q=${encodeURIComponent(q)}`);
  };

  const featured = local.length ? local : topRated;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      {/* Primary action: framed like the Login page (dashed indigo border on larger screens) */}
      <section className="pt-5 md:pt-10" aria-labelledby="home-title">
        <div className="md:grid md:grid-cols-[1fr_minmax(0,28rem)] md:items-center md:gap-10 md:rounded-lg md:border-2 md:border-dashed md:border-indigo-500 md:bg-white md:p-10">
          <div>
            <h1 id="home-title" className="text-3xl md:text-5xl font-extrabold tracking-wide text-gray-900 leading-tight">
              What service do you <span className="bg-indigo-500 text-white px-1">need</span>?
            </h1>
            <p className="mt-2 md:mt-4 text-sm md:text-base text-gray-500 max-w-xl">
              Book a trusted local professional{city ? ` in ${city}` : ''}. Plumbers, electricians, cleaners, AC repair and more, right at your doorstep.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} />
            <Link
              to="/instant-service"
              className="mt-3 flex items-center gap-4 rounded-sm bg-indigo-500 p-4 text-white hover:bg-indigo-600 transition-colors"
            >
              <span className="h-11 w-11 shrink-0 rounded-sm bg-white/15 flex items-center justify-center">
                <Zap className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm text-indigo-100">Need help right now?</span>
                <span className="block text-lg font-semibold tracking-wide">Get Instant Service</span>
              </span>
              <ChevronRight className="h-6 w-6 text-indigo-100" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular services */}
      <section className="mt-8" aria-labelledby="popular-title">
        <div className="flex items-center justify-between mb-3">
          <h2 id="popular-title" className="text-lg md:text-xl font-bold tracking-wide text-gray-900">
            Popular services
          </h2>
          <Link to="/services" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            See all
          </Link>
        </div>
        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-[76px]">
                <Skeleton className="h-16 w-16 rounded-md" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        ) : (
          <CategoryGrid categories={categories} />
        )}
      </section>

      {/* Professionals */}
      <section className="mt-8" aria-labelledby="featured-title">
        <div className="flex items-center justify-between mb-3">
          <h2 id="featured-title" className="text-lg md:text-xl font-bold tracking-wide text-gray-900">
            {local.length ? `Professionals in ${city}` : 'Top-rated professionals'}
          </h2>
          <Link to="/services" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>
        {loading ? (
          <GridSkeleton count={3} />
        ) : error ? (
          <div className="rounded-md border border-gray-200 bg-white">
            <ErrorState description="We couldn't load services right now." onRetry={load} />
          </div>
        ) : featured.length === 0 ? (
          <p className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">No professionals are listed yet. Please check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map((service) => (
              <ProviderCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mt-10" aria-labelledby="how-title">
        <h2 id="how-title" className="text-lg md:text-xl font-bold tracking-wide text-gray-900 mb-3">
          How EZService works
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Search, title: 'Search', text: 'Pick a service or describe your problem.' },
            { icon: ShieldCheck, title: 'Choose', text: 'Compare professionals, prices and ratings.' },
            { icon: CalendarCheck, title: 'Book', text: 'Schedule a visit or get help right now.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="flex items-start gap-3 rounded-md bg-white border border-gray-200 p-4">
              <span className="h-10 w-10 shrink-0 rounded-sm bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  {i + 1}. {title}
                </p>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Provider signup (secondary) */}
      {!loggedIn && (
        <section className="mt-8 mb-4">
          <Link to="/provider/register" className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-4 hover:border-indigo-300">
            <span className="h-10 w-10 shrink-0 rounded-sm bg-gray-100 text-gray-700 flex items-center justify-center">
              <Briefcase className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-gray-900">Are you a service professional?</span>
              <span className="block text-sm text-gray-500">Join EZService and get bookings in your city.</span>
            </span>
            <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
}

export default UserHome;
