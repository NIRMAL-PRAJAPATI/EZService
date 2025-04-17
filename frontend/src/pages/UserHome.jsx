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

function UserHome() {
  return (
    <div>
      <HeroSection />
      {/* <Search /> */}
      <Category />
      <Services />
      <TopCity />
      <Sponser />
      <Template />
      <UserReview />
      <LRAlert />
    </div>
  );
}

export default UserHome;
