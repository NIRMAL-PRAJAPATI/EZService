import { Megaphone } from 'lucide-react'
import React from 'react'

function Announs() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden break-inside-avoid mb-4">
          <div className="bg-indigo-500 p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-white rounded-md p-2">
                <Megaphone className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white -mb-1">
                  Platform Announcement
                </h3>
                <span className="text-xs text-gray-100">Posted 3 days ago</span>
              </div>
            </div>
          </div>
          <div className="p-3">
            <h4 className="text-base font-medium text-gray-900">
              New Features Released!
            </h4>
            <p className="mt-2 text-sm text-gray-600">
              We've just launched several new features to help service providers
              showcase their work and connect with clients more effectively.
            </p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Enhanced portfolio display options</li>
              <li>Improved messaging system</li>
              <li>New payment processing methods</li>
            </ul>
            <div className="mt-1">
              <a
                href="#"
                className="text-sm font-medium text-indigo-500 hover:text-indigo-500"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
  )
}

export default Announs