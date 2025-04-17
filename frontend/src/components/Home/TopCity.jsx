import React from 'react'

function TopCity() {
  return (
    <section className="bg-gray-100 py-5 text-black">
        <div className="sm:p-6 mb-4">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Explore City Services
            </h2>
            <span className="ml-2 mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-indigo-500 rounded">
              NEW
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
            {/* Mumbai Card */}
            <div className="bg-white border border-gray-200 hover:border-indigo-500 rounded-lg overflow-hidden">
              <div className="flex">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mumbai_03-2016_31_Gateway_of_India.jpg/1200px-Mumbai_03-2016_31_Gateway_of_India.jpg"
                  alt="Gateway of India, Mumbai"
                  className="w-20 h-20 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-bold text-lg">MUMBAI</h3>
                  <a href="#" className="text-blue-500 flex items-center">
                    Explore
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default TopCity