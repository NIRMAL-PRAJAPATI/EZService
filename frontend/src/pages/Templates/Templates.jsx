import React from 'react'

const Templates = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Templates</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Template Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Home Renovation</h2>
            <p className="text-gray-600">Professional home renovation services and templates</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Wedding Requisites</h2>
            <p className="text-gray-600">Complete wedding planning and service templates</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Home Appliances</h2>
            <p className="text-gray-600">Installation and repair service templates</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Beauty & Spa</h2>
            <p className="text-gray-600">Beauty and wellness service templates</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Party Things</h2>
            <p className="text-gray-600">Event planning and party service templates</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Templates 