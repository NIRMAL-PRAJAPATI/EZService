import React from 'react'
import { Link } from 'react-router-dom'

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
          <Link to="/login" className='px-5 py-2 sm:px-8 sm:py-3 bg-indigo-500 text-white border font-medium rounded-md hover:bg-indigo-500/90'>
            LogIn
          </Link>
          <Link to="/register" className="px-5 py-2 sm:px-8 sm:py-3 bg-transparent border-2 border-indigo-500 font-medium rounded-md hover:bg-white/10">
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LRAlert