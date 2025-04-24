import { BriefcaseBusiness, MapPin, Tag, UserCheck, Verified } from 'lucide-react'
import React from 'react'

function Sponser() {
  return (
    <section className="container px-5 sm:mx-auto my-10 text-black">
        {/* <h1 className="text-3xl font-bold mb-3">Sponsored</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Service Provider Card 1 */}
          <div className="service-card bg-white rounded-xl overflow-hidden border border-gray-300">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                alt="Plumbing service"
                className="w-full h-38 object-cover"
              />
              <div className="flex absolute top-2 right-2 bg-indigo-500/70 text-white text-xs font-bold px-2 py-1 rounded">
                <Verified className="h-4 w-4 mr-1" />
                Verfied
              </div>
            </div>
            <div className="px-4 pt-2 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Quick Fix Plumbing
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center -mt-1">
                    Plumbing
                  </p>
                </div>
                <div className="bg-indigo-500/10 text-indigo-500 font-medium px-2.5 py-0.5 rounded flex items-center">
                  ₹500
                </div>
              </div>
              <div className=" space-y-1">
                <div className="flex items-center text-sm mb-3">
                  <span className="text-gray-700">
                    Pipe repairs, Installations, Drain cleaning
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-indigo-500 mr-2"/>
                  <span className="text-gray-700">
                    Downtown, Westside, North Hills
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <BriefcaseBusiness className="h-4 w-4 text-indigo-500 mr-2"/>
                  <span className="text-gray-700">5+ Years Experiance</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <img
                  src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-10 h-10 object-cover rounded-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-10 h-10 object-cover rounded-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1615266508040-7c47f7339963?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-10 h-10 object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Sponser