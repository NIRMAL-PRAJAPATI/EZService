import React from "react";
import { UserCheck, MapPin, Star, BriefcaseBusiness ,Tag} from "lucide-react";

export default function Services() {
  return (
    <div>
      {/* Featured Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Top Performed Service Providers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOG_n0AljJC0H2H6DfzV7AyYBrPXCZyVDqCQ&s"
                alt="Home Cleaning"
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold -mb-1">
                      Expo Cleaning Service
                    </h3>
                    <p className="text-gray-600">Home Cleaning</p>
                  </div>
                  <span className="bg-indigo-500/10 text-indigo-500 px-2 py-1 rounded-md">
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
      <section className="bg-gray-100 py-5">
        <div className="sm:p-6 mb-4">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Explore City Services
            </h2>
            <span className="ml-2 mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-indigo-500 rounded">
              NEW
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
            {/* Mumbai Card */}
            <div className="bg-white border hover:border-indigo-500 rounded-lg overflow-hidden">
              <div className="flex">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mumbai_03-2016_31_Gateway_of_India.jpg/1200px-Mumbai_03-2016_31_Gateway_of_India.jpg"
                  alt="Gateway of India, Mumbai"
                  className="w-24 h-24 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">MUMBAI</h3>
                  <a href="#" className="text-blue-500 flex items-center mt-1">
                    Explore
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* sponsered service list */}
      <section className="container px-5 sm:mx-auto my-10">
        <h1 className="text-3xl font-bold mb-3">Sponsored</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Provider Card 1 */}
          <div className="service-card bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                alt="Plumbing service"
                className="w-full h-48 object-cover"
              />
              <div className="flex absolute top-2 right-2 bg-indigo-500/70 text-white text-xs font-bold px-2 py-1 rounded">
                <UserCheck className="h-4 w-4 mr-1" />
                Verfied
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Quick Fix Plumbing
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    Plumbing
                  </p>
                </div>
                <div className="bg-indigo-500/10 text-indigo-500 font-medium px-2.5 py-0.5 rounded flex items-center">
                  ₹500
                </div>
              </div>
              <div className="mt-2 space-y-1">
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
                  className="w-16 h-16 object-cover rounded-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1615266508040-7c47f7339963?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
              <a href="success.html">
                <button className="w-full bg-indigo-500 rounded py-2 mt-3 text-white tracking-wide">
                  Visit Profile
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* template section */}
      <section className="bg-white py-12">
        <div className="mx-4 md:mx-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Explore Template Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Wedding Requisites Section */}
            <div className="bg-gray-50 rounded-lg border p-4">
              <h2 className="text-xl font-bold text-gray-900">
                Wedding Requisites
              </h2>
              <p className="text-gray-500 -mt-1 mb-4 text-sm">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Labore, unde.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {/* Banquet Halls */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://image.wedmegood.com/resized/720X/uploads/member/25616/1727946389_234217240.jpg?crop=6,84,1010,568"
                      alt="Banquet Halls"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    Banquet Halls
                  </span>
                </div>
                {/* Bridal Requisite */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/001/887/534/new_medium/pinterest.jpg?1598019283"
                      alt="Bridal Requisite"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    Bridal Requisite
                  </span>
                </div>
                {/* Caterers */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://www.shaadibaraati.com/vendors-profile/f79f778a75e54a9cfedc3400d4e3752e.jpg"
                      alt="Caterers"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    Caterers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
