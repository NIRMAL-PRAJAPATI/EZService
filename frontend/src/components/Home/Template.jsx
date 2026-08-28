import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

function Template({ templates }) {
  if (!templates || templates.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Curated Service Packages
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Complete bundles tailored for renovations, events, beauty, and maintenance
            </p>
          </div>
          <Link
            to="/templates"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 shrink-0"
          >
            <span>All Packages</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              className="bg-gray-50/70 rounded-2xl border border-gray-200 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                    {template.name}
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    Bundle
                  </span>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-5 line-clamp-2">
                  {template.description || "Comprehensive multi-service package designed to cover all your requirements seamlessly."}
                </p>

                {/* Categories Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {template.categories?.map((category, catIndex) => (
                    <Link
                      to={`/services/${category.id}`}
                      key={catIndex}
                      className="group block text-center"
                    >
                      <div className="rounded-xl overflow-hidden mb-2 bg-white aspect-[4/3] border border-gray-200 shadow-2xs group-hover:border-indigo-400 group-hover:shadow-xs transition">
                        <img
                          src={
                            category.cover_image ||
                            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80"
                          }
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600 truncate block transition">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Template;
