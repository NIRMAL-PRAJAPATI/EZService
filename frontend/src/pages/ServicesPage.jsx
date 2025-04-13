import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import Sidebar from "../components/Service/Sidebar"
import ServiceCard from "../components/Service/ServiceCard"

export default function ServicesPage() {
  const services = [
    {
      title: "Home Cleaning",
      description: "Professional cleaning services for your home needs",
      isActive: true,
    },
    {
      title: "Plumbing Services",
      description: "Expert plumbing solutions for all requirements",
    },
    {
      title: "Electrical Work",
      description: "Certified electricians for your electrical needs",
    },
    {
      title: "Carpentry",
      description: "Custom woodwork and furniture repair services",
    },
    {
      title: "Painting",
      description: "Professional painting services for your space",
    },
    {
      title: "Plumbing Services",
      description: "Expert plumbing solutions for all requirements",
    },
    {
      title: "Electrical Work",
      description: "Certified electricians for your electrical needs",
    },
    {
      title: "Carpentry",
      description: "Custom woodwork and furniture repair services",
    },
    {
      title: "Painting",
      description: "Professional painting services for your space",
    },
  ]

  const serviceProviders = [
    {
      id: "1",
      name: "Ananta Plumbing Service",
      price: "₹4100",
      location: "Ahmedabad, Gujarat, India",
      rating: 4,
      imageUrl:
        "https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg",
      isAvailable: true,
      href: "/service-profile/1",
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-1">
        <Sidebar services={services} />

        <div className="md:col-span-3 lg:col-span-4 space-y-4 overflow-y-scroll h-[100vh] z-0">
          <div className="bg-white py-2 px-4 rounded-lg w-100 m-2">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search service providers..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <Search className="absolute left-2 top-2 text-primary" />
                </div>
              </div>
              <SlidersHorizontal className="mt-2 text-gray-500 hover:text-primary cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-2 md:px-0 sm:m-2">
            {serviceProviders.map((provider) => (
              <ServiceCard key={provider.id} {...provider} />
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-6">
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page ? "bg-primary text-white" : "hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}