import React from 'react'

function LRAlert() {
  return (
      <section className="bg-white p-10 text-black">
        <div className="py-10 px-5 text-center border-indigo-500 border-dashed border-2 rounded-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-md mb-5 text-gray-700">
            Join thousands of satisfied customers and service providers on our
            platform
          </p>
          <div className="flex  gap-1 justify-center">
            <a
              href="login.html"
              className="px-5 py-2 sm:px-8 sm:py-3 bg-indigo-500 text-white border font-medium rounded-md hover:bg-indigo-500/90"
            >
              LogIn
            </a>
            <a
              href="registration.html"
              className="px-5 py-2 sm:px-8 sm:py-3 bg-transparent border-2 border-indigo-500 font-medium rounded-md hover:bg-white/10"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>
  )
}

export default LRAlert