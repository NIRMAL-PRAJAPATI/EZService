import { AlertTriangle } from 'lucide-react'
import React from 'react'

function UserComp() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden break-inside-avoid mb-4">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500/10 rounded-md p-2">
                  <AlertTriangle className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 -mb-1 truncate">
                    Complaint #1082
                  </h3>
                  <span className="text-xs text-gray-500">Filed 5 days ago</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium line-clamp-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </p>
            <p className="mt-1 text-sm text-gray-600 line-clamp-6">
              The service was not delivered as described. I paid for a premium
              package but received the basic service instead.
            </p>
            <div className="mt-3 flex items-center">
              <span className="text-xs text-gray-500">Filed by:</span>
              <span className="ml-1 text-xs font-medium text-gray-900 truncate">
                Robert Thompson
              </span>
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-xs text-gray-500">Against:</span>
              <span className="ml-1 text-xs font-medium text-gray-900 truncate">
                Premium Cleaning Services
              </span>
            </div>
            <p className="text-gray-500 text-[10px] mt-3">Replied By</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                    alt=""
                  />
                  <div className="ml-2">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      Premium Cleaning Services
                    </p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-600 line-clamp-3">
                We sincerely apologize for the confusion.
              </p>
            </div>
          </div>
        </div>
  )
}

export default UserComp