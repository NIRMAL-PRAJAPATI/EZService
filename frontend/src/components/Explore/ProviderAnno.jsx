import React from 'react'

function ProviderAnno() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden break-inside-avoid mb-4">
          <div className="p-3">
            <div className="flex items-center">
              <img
                className="h-12 w-12 rounded-xl"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                alt=""
              />
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 truncate">
                  Ananta Services
                </h3>
                <div className="flex items-center -mt-1">
                  <span className="text-xs text-gray-500">Provider</span>
                  <span className="mx-1 text-gray-500">•</span>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">3 Services</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 line-clamp-5">
              Specializing in responsive web design and UI/UX. Over 5 years of
              experience creating beautiful, functional websites for clients
              across various industries.
            </p>
          </div>
        </div>
  )
}

export default ProviderAnno