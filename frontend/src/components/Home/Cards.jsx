import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCategoryCards = ({ services, city }) => {
  if (!services || services.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-6 container mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize tracking-tight">
              Popular Services in {city || "Your City"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Locally available services with fast dispatch and verified technicians
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0"
          >
            <span>Explore City</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Service Cards */}
        <div className="overflow-x-auto removeScroll pb-2">
          <div className="flex gap-4 w-max">
            {services.map((category) => (
              <div
                key={category.id}
                className="bg-gray-50/70 hover:bg-white border border-gray-200 hover:border-indigo-400 rounded-xl p-3.5 w-[200px] hover:shadow-md transition-all duration-150 flex flex-col justify-between"
              >
                <Link
                  to={`/services/${category.id}`}
                  className="flex flex-col items-center text-center h-full justify-between"
                >
                  <div className="w-28 h-28 mb-3 overflow-hidden rounded-lg bg-white p-1 flex items-center justify-center">
                    <img
                      src={
                        category.cover_image ||
                        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80"
                      }
                      alt={category.name}
                      className="w-full h-full object-cover rounded"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs font-bold text-indigo-600">
                      ₹{category.visiting_charge || "300"}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryCards;
