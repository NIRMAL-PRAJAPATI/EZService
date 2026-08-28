import React, { useEffect, useState, useMemo } from 'react';
import { AlignLeft, Search, SlidersHorizontal, XIcon, ArrowLeft, AlertCircle, ChevronRight } from 'lucide-react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import Sidebar from '../components/Service/Sidebar';
import api from '../config/axios-config';
import ServiceCard from '../components/Service/ServiceCard';
import Loading from '../components/Loading';

function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const { category: categoryParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');

  // Sync category param from URL
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }
  }, [categoryParam]);

  // Initial URL search query parameter
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Load categories list on mount
  useEffect(() => {
    api.get('/category/')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });
  }, []);

  // Fetch services when activeCategory changes
  useEffect(() => {
    setIsLoading(true);

    if (activeCategory && activeCategory !== 'all') {
      api.get(`/services/${activeCategory}/category`)
        .then((res) => {
          setServices(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error('Error fetching category services:', err);
          setServices([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      api.get('/services/?limit=50')
        .then((res) => {
          setServices(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error('Error fetching services:', err);
          setServices([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeCategory]);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      navigate('/services');
    } else {
      navigate(`/services/${catId}`);
    }
  };

  // Filter & sort services
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Filter by search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.ProviderInfo?.name?.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q) ||
          s.ServiceCategory?.name?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (Number(a.visiting_charge) || 0) - (Number(b.visiting_charge) || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (Number(b.visiting_charge) || 0) - (Number(a.visiting_charge) || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.average_rating) || 0) - (Number(a.average_rating) || 0));
    }

    return result;
  }, [services, searchTerm, sortBy]);

  const activeCategoryObj = categories.find((c) => String(c.id) === String(activeCategory));

  if (isLoading && categories.length === 0) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3.5 px-4 sm:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium truncate">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/services" className="hover:text-indigo-600">Services</Link>
            {activeCategoryObj && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-gray-900 font-semibold truncate">{activeCategoryObj.name}</span>
              </>
            )}
          </div>

          <Link
            to="/instant-service"
            className="text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 transition shrink-0 ml-2"
          >
            ⚡ Need Instant Service?
          </Link>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <Sidebar
              menuOpen={menuOpen}
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={handleCategoryChange}
              setMenuOpen={setMenuOpen}
            />
          </div>

          {/* Right Main Content */}
          <div className="md:col-span-3 lg:col-span-4 space-y-6">
            {/* Control Bar: Header, Search & Filter */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {activeCategoryObj ? activeCategoryObj.name : 'All Professional Services'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    Showing <span className="font-semibold text-gray-800">{filteredServices.length}</span> verified providers
                  </p>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="md:hidden inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-50 text-indigo-600 font-semibold text-xs rounded-xl border border-indigo-200"
                >
                  <AlignLeft className="w-4 h-4" />
                  <span>Browse Categories</span>
                </button>
              </div>

              {/* Search & Sort Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by service, provider, or location..."
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 text-xs sm:text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition cursor-pointer"
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="rating">Sort: Highest Rated</option>
                    <option value="price-low">Sort: Price (Low to High)</option>
                    <option value="price-high">Sort: Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Providers Grid */}
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <Loading />
              </div>
            ) : filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <ServiceCard services={filteredServices} />
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-gray-200">
                <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No services found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                  {searchTerm
                    ? `No providers matched "${searchTerm}". Try a different keyword or clear your search.`
                    : 'There are currently no active providers listed in this category.'}
                </p>
                <div className="flex justify-center gap-2">
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('all')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition shadow-xs"
                  >
                    View All Services
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;