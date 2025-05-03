"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  BadgeCheck,
  Briefcase,
  MapPin,
  CircleAlert,
  Star,
  ChevronRight,
  Check,
  ShieldUserIcon,
  ClockArrowUpIcon,
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
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-white mb-7">
            <span>Services</span>
            <ChevronRight className="h-4 w-4" />
            <span>{serviceData?.ServiceCategory?.name}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-medium">{serviceData?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 -mt-10">
        <div className="sm:rounded-sm overflow-hidden">
          {/* Service Header */}
          <div className="p-5 md:p-8 border mb-2 bg-white sm:rounded-md border-gray-200">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-shrink-0 mx-auto">
                <div className="relative">
                  <img
                    src={serviceData?.cover_image || "/placeholder.svg?height=240&width=240"}
                    alt={serviceData?.name}
                    className="w-60 h-60 object-cover rounded-lg border border-gray-200"
                  />
                  {serviceData?.badge_status && (
                    <div className="absolute top-3 right-3 bg-indigo-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">{serviceData?.name}</h1>
                  {serviceData?.badge_status && (
                    <span className="hidden sm:flex bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs items-center gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified Service
                    </span>
                  )}
                </div>

                <div className="mt-2 flex justify-between">
                  <p className="text-indigo-500 font-medium">{serviceData?.ServiceCategory?.name}</p>
                  <div className="flex gap-2">
                    <div className="flex items-center text-indigo-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(serviceData?.average_rating || 0) ? "fill-indigo-500" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 mt-0.5">{serviceData?.reviews_count || reviews.length} reviews</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-sm">
                    <div className="bg-indigo-100 p-2 rounded-sm">
                      <ShieldUserIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{serviceData?.ProviderInfo?.name}</p>
                      <p className="text-xs text-gray-500">Service Provider</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-sm">
                    <div className="bg-indigo-100 p-2 rounded-sm">
                      <ClockArrowUpIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{serviceData?.fulfillments || 0}+ Fullfilled Service Requiests</p>
                      <p className="text-xs text-gray-500">Successfully Fulfilled</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-sm">
                    <div className="bg-indigo-100 p-2 rounded-sm">
                      <Briefcase className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{serviceData?.experience || 0}+ Years of Experiance</p>
                      <p className="text-xs text-gray-500">Professional Experience</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-sm">
                    <div className="bg-indigo-100 p-2 rounded-sm">
                      <MapPin className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium truncate max-w-[200px]">
                        {serviceData?.locations?.join(", ")}
                      </p>
                      <p className="text-xs text-gray-500">Service Locations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-md border border-gray-200 shadow-sm grid grid-cols-1 lg:grid-cols-3 lg:gap-5">
            <div className="lg:col-span-2 space-y-5 order-2 lg:order-1 p-6">
              {/* Description */}
              <section>
                <p className="text-gray-500">{serviceData?.description}</p>
              </section>

              {/* Services Provided */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Services Provided</h2>
                <ul className="">
                  {serviceData?.specifications?.map((service, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      {service}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Working Images */}
              <section>
                <div className="overflow-x-auto">
                  <div className="gap-4 flex justify-center w-max">
                    {serviceData?.working_images?.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square overflow-hidden rounded-lg border border-gray-200 hover:border-indigo-500 h-50 w-50 transition-colors"
                      >
                        <img
                          src={image || "/placeholder.svg?height=200&width=200"}
                          alt={`Work sample ${index + 1}`}
                          className="h-full w-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-indigo-500">
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
                      <div key={index} className="px-4 py-2 bg-gray-50 rounded-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{review.name}</p>
                            <div className="flex items-center text-indigo-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 mr-0.5 ${i < Math.floor(review.rating || 0) ? "fill-indigo-500" : ""}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{review.created}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No reviews yet.</p>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:bg-gray-50 rounded-lg p-6 lg:m-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Service Charge</h3>

                <div className="flex items-center gap-1 mb-2">
                  <span className="text-3xl font-bold text-indigo-500">₹{serviceData?.visiting_charge}</span>
                  <div
                    onClick={handleTermsClick}
                    className="cursor-pointer text-gray-400 hover:text-gray-600"
                    title="View terms and conditions"
                  >
                    <CircleAlert className="h-4 w-4 mt-1" />
                  </div>
                </div>

                <div className="text-sm mb-5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Verified Provider</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Satisfaction Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700">Secure Payments</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleGetService}
                    className="py-2 px-4 bg-indigo-500 hover:bg-indigo-700 text-white font-medium rounded-sm transition-colors">Book Now</button>

                  <button onClick={handleChat}
                    className="py-2 px-4 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 font-medium rounded-sm transition-colors">
                    Contact Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceProfilePage
