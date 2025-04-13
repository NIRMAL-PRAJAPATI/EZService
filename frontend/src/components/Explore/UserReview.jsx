import { Star } from 'lucide-react'
import React from 'react'

function UserReview() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden break-inside-avoid mb-4">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-lg"
                  src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7"
                  alt=""
                />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    Emily Chen
                  </h3>
                  <div className="flex items-center text-indigo-500 space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-4">
              David was exceptional! He delivered the logo design ahead of
              schedule and was very responsive to my feedback.
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {[
                "#goodservice",
                "#trusted",
                "#honestman",
                "#good",
                "#verified",
                "#nice",
                "#service",
              ].map((tag) => (
                <p key={tag} className="text-indigo-500 text-xs">
                  {tag}
                </p>
              ))}
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-gray-500">Review for:</span>
              <a
                href="#"
                className="ml-1 text-xs font-medium text-indigo-500 hover:text-indigo-500 truncate"
              >
                Ananta Service Provider
              </a>
            </div>
          </div>
        </div>
  )
}

export default UserReview