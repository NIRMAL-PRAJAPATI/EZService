import React from "react";
import { MapPin, Star, ChevronRight, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Services({ services }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-10 px-4 sm:px-6 container mx-auto text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Featured Services
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Top-rated, verified professional services ready to assist you
          </p>
        </div>
        <Link
          to="/services"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition shrink-0"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Services Horizontal / Grid Container */}
      <div className="w-full overflow-x-auto removeScroll pb-2">
        <div className="flex gap-4 w-max">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 w-[280px] flex flex-col justify-between"
            >
              <Link to={`/service/${service.id}`} className="block h-full flex flex-col">
                {/* Image Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={
                      service.cover_image ||
                      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80"
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-indigo-600 font-bold text-xs px-2.5 py-1 rounded shadow-xs">
                    ₹{service.visiting_charge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-indigo-600 truncate max-w-[170px]">
                        {service?.ProviderInfo?.name || "Verified Provider"}
                      </span>
                      <div className="flex items-center gap-1 text-gray-800 font-semibold">
                        <Star className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />
                        <span>{parseFloat(service?.average_rating || 4.5).toFixed(1)}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                      {service.name}
                    </h3>

                    <p className="line-clamp-2 text-xs text-gray-600 mb-3 leading-relaxed">
                      {service.description || "Expert service provided with high quality standards and satisfaction guarantee."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1 shrink-0" />
                    <span className="truncate">
                      {[service.city, service.state].filter(Boolean).join(", ") || "All Locations"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
