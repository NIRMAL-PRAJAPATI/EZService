import React from 'react';
import { Link } from 'react-router-dom';

function Category({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-white border-b border-gray-200 py-3 shadow-xs">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto removeScroll">
          <div className="flex items-center justify-start sm:justify-center gap-2 w-max sm:w-auto mx-auto py-1">
            {categories?.map((category) => (
              <Link
                to={`/services/${category.id}`}
                key={category.id}
                className="text-xs sm:text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-indigo-300 transition duration-150 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Category;