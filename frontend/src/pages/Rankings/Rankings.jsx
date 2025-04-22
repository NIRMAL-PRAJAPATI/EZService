"use client"

import { useState } from "react"
import { BsList } from "react-icons/bs"
import { IoIosArrowDown } from "react-icons/io"
// Fix the import paths to match your project structure
import ServiceList from "./ServiceList"
import RankingCard from "./Ranking-cards"
import "./Rankings.css"

const Rankings = () => {
  const [isServiceListOpen, setIsServiceListOpen] = useState(false)

  const rankingsData = [
    {
      position: "1st",
      name: "Premium Cleaning Services",
      location: "Ahmedabad, Gujarat, India",
      imageUrl: "https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg",
      metrics: {
        "Customer Satisfaction": "98%",
        "Service Reliability": "95%",
        "Response Time": "92%",
      },
    },
    {
      position: "2nd",
      name: "Ananta Plumbing Service",
      location: "Ahmedabad, Gujarat, India",
      imageUrl: "https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg",
      metrics: {
        "Customer Satisfaction": "98%",
        "Service Reliability": "95%",
        "Response Time": "92%",
      },
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <ServiceList isOpen={isServiceListOpen} onClose={() => setIsServiceListOpen(false)} />

      <div className="max-w-7xl mx-auto p-2 z-0">
        {/* Header Section */}
        <div className="flex justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Service Rankings</h1>
          <button
            id="openServiceList"
            onClick={() => setIsServiceListOpen(true)}
            className="flex items-center border py-2 px-3 rounded tracking-wide bg-primary text-white"
          >
            <BsList className="mr-1" />
            List
          </button>
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {rankingsData.map((ranking, index) => (
            <RankingCard key={index} {...ranking} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-6">
          <button className="flex items-center text-center text-primary font-semibold">
            Load More
            <IoIosArrowDown className="ml-1 mt-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Rankings
