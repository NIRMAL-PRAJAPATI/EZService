import React from "react";
import { UserCheck, MapPin, Star, BriefcaseBusiness ,Tag} from "lucide-react";

export default function Services() {
  return (
    <div>
      {/* Featured Services */}
      <section className="py-5 text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Top Performed Service Providers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOG_n0AljJC0H2H6DfzV7AyYBrPXCZyVDqCQ&s"
                alt="Home Cleaning"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold -mb-1">
                      Expo Cleaning Service
                    </h3>
                    <p className="text-gray-600">Home Cleaning</p>
                  </div>
                  <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md text-sm">
                    ₹2000
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Star className="h-4 w-4 text-indigo-500 fill-indigo-500"/>
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-600 text-[12px]">
                    (156 reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 my-1 text-sm">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>Ahmedabad, Gujarat</span>
                </div>
              </div>
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
