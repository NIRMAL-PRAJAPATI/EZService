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
  Webhook
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const messages = [
    "Electrician",
    "Plumber",
    "Technician",
    "Mechanic",
    "Home Cleaning",
    "Appliance Repair",
  ];

  const [displayText, setDisplayText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Typing effect loop
  React.useLayoutEffect(() => {
    const currentMessage = messages[messageIndex];
    let timeout;

    if (!isDeleting && charIndex < currentMessage.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentMessage.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, 100);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentMessage.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, 60);
    } else {
      timeout = setTimeout(() => {
        if (!isDeleting) {
          setIsDeleting(true);
        } else {
          setIsDeleting(false);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }
      }, 1200);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messageIndex]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 sm:py-24 overflow-hidden relative border-b border-indigo-950/50">
      {/* Floating subtle monochrome background icons */}
      <div className="text-gray-600/30 overflow-hidden pointer-events-none select-none">
        <Plug className="absolute top-16 left-24 rotate-[330deg] w-8 h-8" />
        <LibraryBig className="absolute top-[280px] right-20 w-8 h-8" />
        <Car className="absolute top-[360px] left-[15vw] rotate-[330deg] w-8 h-8" />
        <Wrench className="absolute top-[420px] right-40 rotate-[10deg] w-8 h-8" />
        <BriefcaseBusiness className="absolute top-20 right-[20vw] rotate-[330deg] w-8 h-8" />
        <Dumbbell className="absolute top-[380px] left-10 rotate-[330deg] w-8 h-8" />
        <ScanHeart className="absolute top-[240px] left-8 w-8 h-8" />
        <PartyPopper className="absolute top-[300px] right-[30%] rotate-[330deg] w-8 h-8" />
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/20 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            <span>Trusted On-Demand Local Home & Commercial Services</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Find Trusted Services Like{" "}
            <span className="text-indigo-400 inline-block">
              {displayText}
              <span className="text-indigo-200 animate-pulse font-normal">|</span>
            </span>
            <br />
            <span>Right at Your Doorstep</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Connect instantly with verified, highly-rated service professionals in your area for transparent rates and quick response times.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center bg-white/95 backdrop-blur-md rounded-lg p-1.5 shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-indigo-400 transition">
              <div className="pl-3 pr-2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What service do you need? (e.g. Electrician, AC Repair, Cleaning)..."
                className="w-full px-2 py-2.5 text-gray-900 bg-transparent text-sm sm:text-base focus:outline-none placeholder-gray-400 font-medium"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md transition duration-150 shrink-0 cursor-pointer shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <Link
              to="/services"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-sm transition"
            >
              Explore All Services
            </Link>
            <Link
              to="/instant-service"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-md border border-white/20 transition flex items-center gap-1.5"
            >
              <Webhook className="w-4 h-4 text-indigo-300" />
              <span>Book Instant Request</span>
            </Link>
            <Link
              to="/provider/register"
              className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white text-sm font-semibold rounded-md border border-gray-600 transition"
            >
              Become a Provider
            </Link>
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 text-center">
            <div className="p-2">
              <p className="text-xl sm:text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Verified Experts</p>
            </div>
            <div className="p-2">
              <p className="text-xl sm:text-2xl font-bold text-white">10,000+</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Services Delivered</p>
            </div>
            <div className="p-2">
              <p className="text-xl sm:text-2xl font-bold text-white">4.8 / 5.0</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Customer Rating</p>
            </div>
            <div className="p-2">
              <p className="text-xl sm:text-2xl font-bold text-white">15 Mins</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Instant Matching</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
