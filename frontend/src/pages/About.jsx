import React from 'react';
import Hero from '../components/About/Hero';
import Principle from '../components/About/Principle';
import Process from '../components/About/Process';
import Growth from '../components/About/Growth';
import Map from '../components/About/Map';

function About() {
    return (
        <>
        <Hero />
        <Principle />
        <div
    className="relative py-12 px-5 bg-center bg-cover"
    style={{ backgroundImage: 'url("https://etimg.etb2bimg.com/photo/114998485.cms")' }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/70" />
    {/* Centered Content */}
    <div className="relative z-10 flex items-center justify-center h-full">
      <h1 className="text-white text-4xl sm:text-6xl font-extrabold text-center uppercase text-shadow-lg">
      "<span className='text-indigo-500 text-5xl sm:text-7xl'>Connecting</span> customers with providers in
        <p>just a few <span className='text-indigo-500 text-5xl sm:text-7xl'>clicks</span>"</p>
      </h1>
    </div>
  </div>
        <Process />
        <Growth />
        <Map />
  </>
    )
}

export default About
