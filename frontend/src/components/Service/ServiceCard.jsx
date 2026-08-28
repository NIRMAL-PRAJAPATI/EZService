import React from 'react';
import { Star, MapPin, ChevronRight, UserCheck, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ services }) => {
  const navigate = useNavigate();

  const handleBookNow = (e, serviceId) => {
    e.stopPropagation();
    navigate(`/book?serviceId=${serviceId}`);
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <>
      {services.map((service) => {
        const rating = Number(service?.average_rating) || 4.5;
        const filledStars = Math.min(5, Math.max(1, Math.floor(rating)));
        const emptyStars = Math.max(0, 5 - filledStars);

        return (
          <div
            key={service.id}
            onClick={() => navigate(`/service/${service?.id}`)}
            className="group bg-white rounded-2xl border border-gray-200 hover:border-indigo-400 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Cover Image & Price */}
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
                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-lg shadow-xs">
                  ₹{service.visiting_charge || "300"}
                </div>
                {service.ServiceCategory?.name && (
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {service.ServiceCategory.name}
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-4">
                {/* Provider Name & Rating */}
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-indigo-600 truncate max-w-[140px]">
                    {service?.ProviderInfo?.name || "Verified Provider"}
                  </span>
                  <div className="flex items-center gap-1 text-gray-800 font-bold">
                    <Star className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                  {service.description || "Professional service guaranteed with quality and reliability."}
                </p>
              </div>
            </div>

            {/* Bottom Actions & Location */}
            <div className="p-4 pt-0">
              <div className="flex items-center text-xs text-gray-500 mb-3 pt-2.5 border-t border-gray-100">
                <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1 shrink-0" />
                <span className="truncate">
                  {[service.city, service.state].filter(Boolean).join(", ") || "All Areas"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleBookNow(e, service.id)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition duration-150 cursor-pointer text-center"
                >
                  Book Service
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ServiceCard;