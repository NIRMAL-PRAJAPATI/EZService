import React from 'react';
import { XIcon, ChevronRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ categories, menuOpen, activeCategory, setActiveCategory, setMenuOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto z-30 md:z-0 w-72 md:w-full bg-white border-r border-gray-200 p-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base text-gray-900">Categories</h2>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Category List */}
        <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] pr-1 removeScroll">
          {/* All Categories Option */}
          <li>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeCategory === 'all' || !activeCategory
                  ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              <span>All Services</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </li>

          {/* Individual Category Items */}
          {categories?.map((category) => {
            const isActive = String(activeCategory) === String(category.id);

            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 font-medium'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="block truncate">{category.name}</span>
                    {category.description && (
                      <span className="block text-[11px] text-gray-400 font-normal truncate">
                        {category.description}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;