import React from "react";
import {
  User,
  Image,
  MessageSquare,
  AlertTriangle,
  Megaphone,
  BadgeCheck,
  Heart,
  Star,
  ChevronDown,
} from "lucide-react";
import ServiceProfile from "../components/Explore/ServiceProfile";
import UserReview from "../components/Explore/UserReview";
import UserComp from "../components/Explore/UserComp";
import Announs from "../components/Explore/Announs";
import Header from "../components/Explore/Header";
import ProviderAnno from "../components/Explore/ProviderAnno";

const Explore = () => (
  <>
    <main className=" mx-auto px-4 sm:px-6 lg:px-8 text-black bg-gray-50">
      {/* Filters */}
      <Header />

      {/* Fixed Masonry Grid using CSS columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3 space-y-3">
        {/* Provider Profile Card */}
        

        {/* Service Card */}
        <ProviderAnno />
        <ServiceProfile />
        <UserReview />
        <UserComp />
        <Announs />

        {/* Review Card */}
        

        {/* Complaint Card */}
        

        {/* Announcement Card */}
        
      </div>

      {/* Load More Button */}
      <div className="my-5 text-center">
        <button
          type="button"
          className="inline-flex items-center text-sm font-medium text-indigo-500 focus:outline-none"
        >
          Load More <ChevronDown />
        </button>
      </div>
    </main>
  </>
);

export default Explore