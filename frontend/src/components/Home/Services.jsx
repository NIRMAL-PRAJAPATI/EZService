import React, { useEffect, useState } from "react";
import { UserCheck, MapPin, Star, BriefcaseBusiness ,Tag} from "lucide-react";
import api from "../../config/axios-config";
import { Link } from "react-router-dom";

export default function Services({services}) {


  return (
    <div>
      {/* Featured Services */}
      <section className="p-2 sm:p-5 mx-auto text-black">
        <div>
          <div className="w-full overflow-x-auto removeScroll">
          <div className="gap-2 flex w-max">
            {services.map((service) => (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300 p-4 w-[270px]">
              <Link to={`/service/${service.id}`} className="flex flex-col gap-2">
            <div>
                    <h3 className="text-md font-bold -mb-1">
                      {service?.ProviderInfo?.name}
                    </h3>
                    <p className="text-gray-600 text-xs">{service?.name}</p>
                  </div>
              <img src={service.cover_image ? service.cover_image : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s`}
                className="w-full h-35 object-cover p-0"
              />
              <p className="line-clamp-2 text-sm text-gray-600">{service.description ? service.description : `lorem this is my service description for basic knowledge of service provided by the provider`}</p>
              <div className="mt-2">
                <div className="flex justify-between items-start">
                  <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md text-sm">₹{service.visiting_charge}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-indigo-500 fill-indigo-500"/>
                  <span className="font-medium text-sm">{parseFloat(service?.average_rating || 0).toFixed(1)}</span>
                </div>
                </div>
                <div className="flex items-center gap-2 my-1 text-sm">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>{service.city}, {service.state}, {service.country}</span>
                </div>
              </div>
              </Link>
            </div>
            ))}
          </div>
          </div>
        </div>
      </section>
      {/* city section */}
      
      {/* sponsered service list */}
      
      {/* template section */}
      
    </div>
  );
}
