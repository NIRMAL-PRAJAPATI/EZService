import { BadgeCheck, Heart, Star } from 'lucide-react';
import React from 'react';

function ServiceProfile() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden break-inside-avoid mb-4">
          <p className="mt-2 absolute">
            <span className="flex bg-indigo-500/80 text-white ml-2 px-2 py-0.5 rounded text-[11px]">
              <BadgeCheck className="h-3 w-3 mt-0.5 mr-0.5" />
              Verifed
            </span>
          </p>
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            alt="Portfolio work"
            className="w-full h-48 object-cover"
          />
          <div className="p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 truncate">
                Acrophil AC Service
              </h3>
              <button className="text-gray-400 hover:text-gray-500">
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center text-indigo-500 space-x-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-4">
              Complete redesign of an e-commerce platform focusing on user
              experience and conversion optimization. Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <p className="text-indigo-500 font-bold">₹500</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {["Fast Response", "Low Charge", "Trusted", "Relaible"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 rounded-full text-[10px] tracking-wide font-medium border border-indigo-500/70 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                alt=""
              />
              <div className="ml-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  Michael Roberts
                </span>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ServiceProfile