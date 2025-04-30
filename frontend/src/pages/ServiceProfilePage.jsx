"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  BadgeCheck,
  ShieldIcon as ShieldUser,
  ArrowUpIcon as ClockArrowUp,
  Briefcase,
  MapPin,
  CircleAlert,
  Star,
  MessageCircle,
  Calendar,
  ChevronRight,
} from "lucide-react"
import api from "../config/axios-config"
import Loading from "../components/Loading"

const ServiceProfilePage = () => {
  // This data would typically come from props or an API call
  const [serviceData, setServiceData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    console.log(id)
    api
      .get(`/services/${id}`)
      .then((response) => {
        setServiceData(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setIsLoading(false)
      })

    api
      .get(`/reviews/service/${id}/`)
      .then((response) => {
        setReviews(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleGetService = () => {
    // Handle service request logic
    console.log("Service requested")
  }

  const handleChat = () => {
    // Handle chat initiation logic
    console.log("Chat initiated")
  }

  const handleTermsClick = () => {
    // Handle terms and conditions click
    console.log("Terms and conditions clicked")
  }

  if (isLoading) return <Loading />

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <span>Services</span>
            <ChevronRight className="h-4 w-4" />
            <span>{serviceData?.ServiceCategory?.name}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium">{serviceData?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Service Header */}
          <div className="p-6 md:p-8 border-b">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={serviceData?.cover_image || "/placeholder.svg?height=240&width=240"}
                    alt={serviceData?.name}
                    className="w-60 h-60 object-cover rounded-lg border border-gray-200"
                  />
                  {serviceData?.badge_status && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="flex items-center text-indigo-600 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(serviceData?.average_rating || 0) ? "fill-indigo-500" : ""}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{serviceData?.reviews_count || reviews.length} reviews</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{serviceData?.name}</h1>
                  {serviceData?.badge_status && (
                    <span className="hidden sm:flex bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified Service
                    </span>
                  )}
                </div>

                <p className="text-indigo-600 font-medium mt-1">{serviceData?.ServiceCategory?.name}</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <ShieldUser className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{serviceData?.ProviderInfo?.name}</p>
                      <p className="text-xs text-gray-500">Service Provider</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <ClockArrowUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{serviceData?.fulfillments || 0}+ Requests</p>
                      <p className="text-xs text-gray-500">Successfully Fulfilled</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{serviceData?.experience || 0}+ Years</p>
                      <p className="text-xs text-gray-500">Professional Experience</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium truncate max-w-[200px]">
                        {serviceData?.locations?.join(", ")}
                      </p>
                      <p className="text-xs text-gray-500">Service Locations</p>
                    </div>
                  </div>
                </div>

                {/* <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleGetService}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Service
                  </button>
                  <button
                    onClick={handleChat}
                    className="px-6 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chat with Provider
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 md:p-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">About This Service</h2>
                <p className="text-gray-700 leading-relaxed">{serviceData?.description}</p>
              </section>

              {/* Services Provided */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Services Provided</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {serviceData?.specifications?.map((service, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1 bg-indigo-100 rounded-full p-1 flex-shrink-0">
                        <BadgeCheck className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-gray-700">{service}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Working Images */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {serviceData?.working_images?.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors"
                    >
                      <img
                        src={image || "/placeholder.svg?height=200&width=200"}
                        alt={`Work sample ${index + 1}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-indigo-600">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(serviceData?.average_rating || 0) ? "fill-indigo-500" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 font-medium">
                      {serviceData?.average_rating ? parseFloat(serviceData?.average_rating)?.toFixed(1) : "0.0"}
                    </span>
                  </div>
                </div>

                {reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">{review.name}</p>
                            <div className="flex items-center text-indigo-600 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(review.rating || 0) ? "fill-indigo-500" : ""}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{review.created}</span>
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No reviews yet.</p>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing</h3>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-3xl font-bold text-indigo-600">₹{serviceData?.visiting_charge}</span>
                  <div
                    onClick={handleTermsClick}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    title="View terms and conditions"
                  >
                    <CircleAlert className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Verified Provider</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Satisfaction Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Secure Payments</span>
                  </div>
                </div>

                <button
                  onClick={handleGetService}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors mb-3"
                >
                  Book Now
                </button>

                <button
                  onClick={handleChat}
                  className="w-full py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors"
                >
                  Contact Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceProfilePage
