import React from 'react';
import { MapPin, Verified, BriefcaseBusiness, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Sponser({ services }) {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-10 px-4 sm:px-6 container mx-auto text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Verified Top Pros
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-indigo-600 rounded flex items-center gap-1">
              <Verified className="w-3 h-3" />
              <span>GUARANTEED</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Hand-picked service professionals with proven work records & top satisfaction
          </p>
        </div>
      </div>

      {/* Services Scroll Container */}
      <div className="w-full overflow-x-auto removeScroll pb-2">
        <div className="flex gap-4 w-max">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 w-[290px] flex flex-col justify-between"
            >
              <Link to={`/service/${service.id}`} className="block h-full flex flex-col justify-between">
                <div>
                  {/* Image and Verified Tag */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={
                        service.cover_image ||
                        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80"
                      }
                      alt={service.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex items-center gap-1 absolute top-2.5 right-2.5 bg-indigo-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                      <Verified className="h-3 w-3" />
                      <span>Verified</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                          {service.name}
                        </h3>
                        <p className="text-xs text-indigo-600 font-semibold truncate">
                          {service?.ProviderInfo?.name || "Certified Partner"}
                        </p>
                      </div>
                      <div className="bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded text-xs shrink-0 ml-2">
                        ₹{service.visiting_charge}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                      {service.description || "Professional service guaranteed with utmost quality and prompt dispatch."}
                    </p>

                    <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 mr-1.5 shrink-0" />
                        <span className="truncate">
                          {[service.city, service.country].filter(Boolean).join(", ") || "All Areas"}
                        </span>
                      </div>
                    </div>

                    {/* Work Sample Thumbnails */}
                    {service?.working_images && service.working_images.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-1.5 overflow-hidden">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Work:</span>
                        {service.working_images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Sample"
                            className="w-7 h-7 object-cover rounded border border-gray-200"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
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

export default Sponser;