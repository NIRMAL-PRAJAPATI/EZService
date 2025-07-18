import React, { useState } from "react";
import {
  Plug,
  LibraryBig,
  Car,
  Wrench,
  BriefcaseBusiness,
  Dumbbell,
  ScanHeart,
  PartyPopper,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const messages = [
    "Mechenic",
    "Technician",
    "Laboure",
    "Electrician",
    "Trainer",
    "Servant",
  ];

  const [displayText, setDisplayText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect loop
  React.useLayoutEffect(() => {
    const currentMessage = messages[messageIndex];
    let timeout;

    if (!isDeleting && charIndex < currentMessage.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentMessage.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 120);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentMessage.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 90);
    } else {
      timeout = setTimeout(() => {
        if (!isDeleting) {
          setIsDeleting(true);
        } else {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messageIndex]);

  return (
    <div>
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20 overflow-hidden relative">
        {/* Floating icons */}
        <div className="text-gray-600">
          <Plug className="absolute top-24 left-60 rotate-[330deg] z-0" />
          <LibraryBig className="absolute top-[300px] right-20 z-0" />
          <Car className="absolute top-[400px] left-[30vw] rotate-[330deg] z-0" />
          <Wrench className="absolute top-[500px] right-60 rotate-[10deg] z-0" />
          <BriefcaseBusiness className="absolute top-24 right-[25vw] rotate-[330deg] z-0" />
          <Dumbbell className="absolute top-[500px] left-20 rotate-[330deg] z-0" />
          <ScanHeart className="absolute top-[300px] left-10 rotate-[330deg] z-0" />
          <PartyPopper className="absolute top-[350px] right-[35%] rotate-[330deg] z-0" />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 z-10 relative z-0">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-[12px]">
              <p>
                <span className="bg-green-50 text-indigo-500 font-bold px-2 rounded-full">
                  New
                </span>{" "}
                You can also talk to your service provider
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              <p className="flex lg:block flex-col">
                Find Services Like{" "}
                <span>
                  <span className="text-indigo-500">{displayText}</span>
                  <span className="text-gray-300 -ml-2">|</span>
                </span>
              </p>
              <p>at Your Fingertips</p>
            </h1>

            <p className="text-md md:text-md tracking-wide mb-8 text-white/50">
              Connect with trusted service providers in your area and do your
              work quickly and efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link
                to="/services"
                className="px-6 py-3 bg-indigo-500 text-white font-medium rounded"
              >
                Find Services
              </Link>
              <Link
                to="/provider/register"
                className="px-6 py-3 bg-transparent border-2 border-indigo-500 text-white font-medium rounded hover:bg-white/10"
              >
                Become a Provider
              </Link>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full px-4 py-3 text-white bg-transparent border-b border-gray-500 focus:border-white focus:outline-none"
                />
                <button className="text-gray-400 hover:text-white">
                  <Search className="text-xl mt-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
