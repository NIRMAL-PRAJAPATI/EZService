import React from 'react';
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
} from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-gray-900 to-gray-700 py-20 text-white py-20">
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

      {/* Full-width content */}
      <div className="container mx-auto px-4 z-10 relative z-0">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-[12px]">
            <p>
              <span className="bg-green-50 text-indigo-500 font-bold px-2 rounded-full">New</span>{' '}
              You can also talk to your service provider
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            <p className="flex lg:block flex-col">
              Find Services Like{' '}
              <span>
                <span id="text" className="text-indigo-500"></span>
                <span>&nbsp;</span>
              </span>
            </p>
            <p>at Your Fingertips</p>
          </h1>

          <p className="text-md md:text-md tracking-wide mb-8 text-white/50">
            Connect with trusted service providers in your area and do your work quickly and efficiently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="/frontend/views/common/error.html"
              className="px-6 py-3 bg-indigo-500 text-white font-medium rounded"
            >
              Find Services
            </a>
            <a
              href="/frontend/views/provider/index.html"
              className="px-6 py-3 bg-transparent border-2 border-indigo-500 text-white font-medium rounded hover:bg-white/10"
            >
              Become a Provider
            </a>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex gap-2">
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
  );
};

export default Hero;
