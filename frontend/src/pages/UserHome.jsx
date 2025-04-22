import React from "react";
import HeroSection from "../components/Home/HeroSection";
import Services from "../components/Home/Services";
import UserReview from "../components/Home/UserReview";
import Category from "../components/Home/Category";
import Search from "../components/Home/Search";
import TopCity from "../components/Home/TopCity";
import Sponser from "../components/Home/Sponser";
import Template from "../components/Home/Template";
import LRAlert from "../components/Home/LRAlert";
import Card from "../components/Home/Cards";

function UserHome() {
  return (
    <div>
      {/* <HeroSection /> */}
      <Search />
      <Category />
      <Services />
      <div className="p-5 container mx-auto">
      <div className="bg-indigo-500/80 rounded-xl shadow-lg overflow-hidden flex w-full sm:h-100">
      {/* Left Content */}
      <div className="p-8 flex flex-col justify-center sm:w-1/2">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2">
          Air Conditioner Service / Repair
        </h2>
        <p className="text-lg text-gray-200 mb-6">Home Appliences</p>
        <button className="border text-white px-6 py-2 rounded-lg w-fit hover:bg-gray-50/20 transition">
          Explore
        </button>
      </div>
      {/* Right Image */}
      <div className="w-1/2 hidden sm:block">
        <img
          src="https://static.wixstatic.com/media/ade29c_24e1ba8f67a241b5a6a44f04a96fdbd0~mv2.png/v1/fill/w_556,h_366,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto/ade29c_24e1ba8f67a241b5a6a44f04a96fdbd0~mv2.png"
          alt="Home Painting Room"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
    </div>

<Card />

    <div className="p-5 container mx-auto">
      <div className="bg-indigo-500/80 rounded-xl shadow-lg overflow-hidden flex w-full sm:h-100">
      {/* Right Image */}
      <div className="w-1/2 hidden sm:block">
        <img
          src="https://www.shutterstock.com/image-photo/authentic-indian-food-snacks-close-260nw-1960332085.jpg"
          alt="Home Painting Room"
          className="h-full w-full object-cover"
        />
      </div>
      {/* Left Content */}
      <div className="p-8 flex flex-col justify-center sm:w-1/2">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2">
          Just need to Find Best Cataring Services
        </h2>
        <p className="text-lg text-gray-200 mb-6">Catering Service</p>
        <button className="border text-white px-6 py-2 rounded-lg w-fit hover:bg-gray-50/20 transition">
          Explore
        </button>
      </div>
    </div>
    </div>
      <TopCity />
      <Sponser />
      <Template />
      <UserReview />
      <LRAlert />
    </div>
  );
}

export default UserHome;
