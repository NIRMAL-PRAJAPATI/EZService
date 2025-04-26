import React, { useEffect, useState } from "react";
import { UserCheck, MapPin, Star, BriefcaseBusiness ,Tag} from "lucide-react";
import axios from "axios";

export default function Services() {

  const [services, setServices] = useState([]);
  const api = 'http://localhost:3000';

  useEffect(() => {
    axios.get(`${api}/services/`).then(response => {
      setServices(response.data);
      console.log(response.data);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  return (
    <div>
      {/* Featured Services */}
      <section className="py-5 text-black">
        <div className="px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Top Performed Service Providers
          </h2>
          <div className="w-full overflow-x-auto">
          <div className="gap-2 flex w-max">
            {services.map((service) => (
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300 p-4 w-[300px]">
            <div>
                    <h3 className="text-md font-bold -mb-1">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-xs">{service?.ServiceCategory?.name}</p>
                  </div>
              <img src={service.cover_image ? service.cover_image : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s`}
                className="w-full h-40 object-cover p-4"
              />
              <p className="line-clamp-2 text-sm text-gray-600">{service.description}</p>
              <div className="mt-2">
                <div className="flex justify-between items-start">
                  <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md text-sm">₹{service.visiting_charge}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-indigo-500 fill-indigo-500"/>
                  <span className="font-medium text-sm">4.8</span>
                  <span className="text-gray-600 text-[10px]">(156 reviews)</span>
                </div>
                </div>
                <div className="flex items-center gap-2 my-1 text-sm">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>{service.city}, {service.state}, {service.country}</span>
                </div>
              </div>
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
