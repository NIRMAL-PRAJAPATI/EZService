import React from 'react'
import { User, Image, MessageSquare, AlertTriangle, Megaphone } from 'lucide-react'

function Header() {
  return (
    <div className="py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none border-indigo-500 text-indigo-500">
              All
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <User className="h-3.5 w-3.5 mr-1" />
              Providers
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <Image className="h-3.5 w-3.5 mr-1" />
              Services
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              Reviews
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <AlertTriangle className="h-3.5 w-3.5 mr-1" />
              Complaints
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
              <Megaphone className="h-3.5 w-3.5 mr-1" />
              Announcement
            </button>
          </div>
        </div>
      </div>
  )
}

export default Header