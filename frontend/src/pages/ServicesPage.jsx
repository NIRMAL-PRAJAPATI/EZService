import { AlignLeft, Search, SlidersHorizontal, Star, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Service/Sidebar';
import api from '../config/axios-config';
import ServiceCard from '../components/Service/ServiceCard';
import Loading from "../components/Loading"

function ServicesPage() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')

  useEffect(() => {
    Promise.all([
      api.get("/category/"),
      api.get("/services/?limit=20")
    ])
      .then(([categoriesResponse, servicesResponse]) => {
        setCategories(categoriesResponse.data);
        setServices(servicesResponse.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  
  useEffect(()=>{
    if(activeCategory=='')
      return
    setIsLoading(true)

    api.get(`/services/${activeCategory}/category`).then((response)=>{
      setServices(response.data)
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      setIsLoading(false)
    })
  },[activeCategory])

  if(isLoading)
    return <Loading />
  return (
      <div className="text-black mx-auto bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
          <Sidebar menuOpen={menuOpen} categories={categories} setActiveCategory={setActiveCategory}/>
          {/* Right Content Area */}
          <div className="sm:col-span-3 md:col-span-3 lg:col-span-4 space-y-4 overflow-y-scroll h-[90vh] z-0">
            {/* Search and Filter Section */}
            <div className="bg-white pb-2 px-2 sm:px-3 w-full mb-2">
              <div className="flex">
                <AlignLeft onClick={() => setMenuOpen(true)} id="openServiceDivBtn" className="md:hidden mt-2 mr-2 text-gray-500 hover:text-indigo-500 cursor-pointer" />
            {/* Search Box */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search service providers..."
                      className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                    <Search className="absolute left-2 top-2 text-indigo-500" />
                  </div>
                </div>
                {/* Filter Dropdown */}
                <SlidersHorizontal className="mt-2 ml-2 text-gray-500 hover:text-indigo-500 cursor-pointer" />
              </div>
            </div>
            {/* Service Providers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 lg:gap-3 px-2 md:px-0 sm:m-2">
             {/* Service Provider Card 1 */}
              <ServiceCard services={services} />
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