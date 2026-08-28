import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const cityData = [
  {
    city: "Mumbai",
    imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&auto=format&fit=crop&q=80",
    count: "120+ Services",
  },
  {
    city: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&auto=format&fit=crop&q=80",
    count: "95+ Services",
  },
  {
    city: "Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&auto=format&fit=crop&q=80",
    count: "140+ Services",
  },
  {
    city: "Ahmedabad",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&auto=format&fit=crop&q=80",
    count: "80+ Services",
  },
  {
    city: "Hyderabad",
    imageUrl: "https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=400&auto=format&fit=crop&q=80",
    count: "85+ Services",
  },
  {
    city: "Chennai",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop&q=80",
    count: "70+ Services",
  },
  {
    city: "Pune",
    imageUrl: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&auto=format&fit=crop&q=80",
    count: "65+ Services",
  },
  {
    city: "Kolkata",
    imageUrl: "https://images.unsplash.com/photo-1558431382-27e303142255?w=400&auto=format&fit=crop&q=80",
    count: "50+ Services",
  },
];

function TopCity() {
  return (
    <section className="py-10 px-4 sm:px-6 container mx-auto text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Explore by City
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-indigo-600 rounded">
              TOP HUBS
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Find certified service technicians active in your metropolitan area
          </p>
        </div>
      </div>

      {/* Cities Carousel / Row */}
      <div className="w-full overflow-x-auto removeScroll pb-2">
        <div className="flex gap-4 w-max">
          {cityData.map(({ city, imageUrl, count }) => (
            <div
              key={city}
              className="group bg-white border border-gray-200 hover:border-indigo-400 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 w-[220px]"
            >
              <Link to={`/services?city=${city.toLowerCase()}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                    <h3 className="font-bold text-base tracking-wide flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-300" />
                      <span>{city}</span>
                    </h3>
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">{count}</span>
                  <span className="text-indigo-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopCity;
