import { BriefcaseBusiness, MapPin, Tag, UserCheck, Verified } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import api from '../../config/axios-config'

function Sponser({services}) {


  return (
    <section className="px-5 sm:mx-auto my-10 text-black w-full overflow-x-auto">
        {/* <h1 className="text-3xl font-bold mb-3">Sponsored</h1> */}
        <div className="flex gap-4 w-max">
          {services.map((service,key)=>{

            return (<div key={key} className="service-card bg-white rounded-xl overflow-hidden border border-gray-300 w-[270px]">
            <div className="relative">
              <img
                src={service.cover_image || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"}
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
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center -mt-1">
                    {service.ServiceCategory.name}
                  </p>
                </div>
                <div className="bg-indigo-500/10 text-indigo-500 font-medium px-2.5 py-0.5 rounded flex items-center">
                  ₹{service.visiting_charge}
                </div>
              </div>
              <div className=" space-y-1">
                <div className="flex items-center text-sm mb-3">
                  <span className="text-gray-700">
                    {service.description}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-indigo-500 mr-2"/>
                  <span className="text-gray-700">
                    {`${service.city}, ${service.country}`}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <BriefcaseBusiness className="h-4 w-4 text-indigo-500 mr-2"/>
                  <span className="text-gray-700">Joined on {service.created}</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {
                  service?.working_images?.map((image)=>{
                    return (<img
                      src={image || "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"}
                      alt="Work sample"
                      className="w-10 h-10 object-cover rounded-md"
                    />)
                  })
                }
              </div>
            </div>
          </div>)
          })}
        </div>
      </section>
  )
}

export default Sponser