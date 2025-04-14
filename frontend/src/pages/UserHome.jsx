import React from "react";
import HeroSection from "../components/Home/HeroSection";
import Services from "../components/Home/Services";
import UserReview from "../components/Home/UserReview";

function UserHome() {
  return (
    <div>
      <HeroSection />
      <Services />
      <UserReview />
    </div>
  );
}

export default UserHome;
