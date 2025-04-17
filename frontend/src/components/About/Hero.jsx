import React from 'react'

function Hero() {
  return (
    <section className="bg-gray-50">
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-50 transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <div className="pt-10 sm:pt-16 lg:pt-16 lg:pb-14 lg:overflow-hidden">
              <div className="px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">About</span>
                  <span className="block text-indigo-500-600">
                    Our{" "}
                    <span className="text-indigo-500 tracking-wide">
                      EZService
                    </span>
                  </span>
                </h1>
                <p className="mt-3 text-md text-gray-500 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 md:text-md lg:mx-0">
                  Founded in 2010, our company has been at the forefront of
                  innovation, delivering exceptional products and services to our
                  clients worldwide. We're committed to excellence, integrity, and
                  customer satisfaction.
                </p>
                <button className="px-4 py-2 bg-indigo-500 border-none text-white ml-2 mt-3 rounded">
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://miro.medium.com/v2/resize:fit:1400/1*G788U7EQNm70xhiW_hbwew.jpeg"
            alt="Team working together"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero