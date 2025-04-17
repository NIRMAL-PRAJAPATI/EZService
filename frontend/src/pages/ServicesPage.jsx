import React from 'react'

function ServicesPage() {
  return (
      <div className="text-black mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {/* Left Sidebar - Services List */}
          <div
            id="serviceDiv"
            className="lg:col-span-1 bg-white p-1 shadow-md h-fit absolute md:relative z-10 hidden md:block"
          >
            <div className="flex justify-between">
              <i
                data-lucide="x"
                id="closeServiceDivBtn"
                className="md:hidden text-gray-500 hover:text-indigo-500 cursor-pointer"
              />
            </div>
            <ul className="space-y-1 overflow-y-scroll h-[90vh]">
              <li className="p-2 border-b border-indigo-500 bg-indigo-500/10 rounded-t cursor-pointer hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-indigo-500">Home Cleaning</h3>
                <p className="text-xs text-gray-600">
                  Professional cleaning services for your home needs
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Plumbing Services</h3>
                <p className="text-xs text-gray-600">
                  Expert plumbing solutions for all requirements
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Electrical Work</h3>
                <p className="text-xs text-gray-600">
                  Certified electricians for your electrical needs
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Carpentry</h3>
                <p className="text-xs text-gray-600">
                  Custom woodwork and furniture repair services
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Painting</h3>
                <p className="text-xs text-gray-600">
                  Professional painting services for your space
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Plumbing Services</h3>
                <p className="text-xs text-gray-600">
                  Expert plumbing solutions for all requirements
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Electrical Work</h3>
                <p className="text-xs text-gray-600">
                  Certified electricians for your electrical needs
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Carpentry</h3>
                <p className="text-xs text-gray-600">
                  Custom woodwork and furniture repair services
                </p>
              </li>
              <li className="p-2 hover:bg-gray-50 rounded-t cursor-pointer transition-colors">
                <h3 className="font-semibold text-gray-800">Painting</h3>
                <p className="text-xs text-gray-600">
                  Professional painting services for your space
                </p>
              </li>
            </ul>
          </div>
          {/* Right Content Area */}
          <div className="sm:col-span-3 md:col-span-3 lg:col-span-4 space-y-4 overflow-y-scroll h-[90vh] z-0">
            {/* Search and Filter Section */}
            <div className="bg-white py-2 px-4 rounded-lg w-100 m-2">
              <div className="flex gap-4">
                <i
                  data-lucide="align-left"
                  id="openServiceDivBtn"
                  className="md:hidden mt-2 text-gray-500 hover:text-indigo-500 cursor-pointer"
                />
            {/* Search Box */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search service providers..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                    />
                    <i
                      data-lucide="search"
                      className="absolute left-2 top-2 text-indigo-500"
                    />
                  </div>
                </div>
                {/* Filter Dropdown */}
                <i
                  data-lucide="sliders-horizontal"
                  className="mt-2 text-gray-500 hover:text-indigo-500 cursor-pointer"
                />
              </div>
            </div>
            {/* Service Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-0 sm:m-2">
             {/* Service Provider Card 1 */}
              <a
                href="/frontend/views/user/service_profile.html"
                className="bg-white overflow-hidden rounded-lg shadow-sm"
              >
                <div className="items-start">
                  <div className="w-full bg-gray-100 h-30">
                    <img
                      src="https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg"
                      alt="Provider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 pb-3 pr-1 sm:px-3">
                    <span className="text-green-500 bg-gray-100 font-semibold rounded-full px-2 text-[10px] ml-1">
                      Available
                    </span>
                    <h3 className="font-semibold text-md leading-none sm:text-lg sm:leading-none">
                      Ananta Plumbing Service
                    </h3>
                    <p className="text-sm text-gray-600 mb-1 font-semibold">
                      ₹4100
                    </p>
                    <div className="flex items-center space-x-1 text-[12px]">
                      <span className="text-gray-500">
                        Ahmedabad, Gujarat, India
                      </span>
                    </div>
                    <div className="flex items-center text-indigo-500 gap-1 mt-1">
                      <i
                        data-lucide="star"
                        className="h-4 w-4 fill-indigo-500 inline-block"
                      />
                      <i
                        data-lucide="star"
                        className="h-4 w-4 fill-indigo-500 inline-block"
                      />
                      <i
                        data-lucide="star"
                        className="h-4 w-4 fill-indigo-500 inline-block"
                      />
                      <i
                        data-lucide="star"
                        className="h-4 w-4 fill-indigo-500 inline-block"
                      />
                      <i data-lucide="star" className="h-4 w-4 inline-block" />
                    </div>
                  </div>
                </div>
              </a>
            </div>
            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-6">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 border rounded-lg bg-indigo-500 text-white">
                1
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                3
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default ServicesPage