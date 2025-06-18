// const services = [
//     {
//       id: 'kitch-rem',
//       imageSrc: 'https://placehold.co/400x300/e0e7ff/3f51b5?text=Kitchen',
//       altText: 'Kitchen Remodeling',
//       title: 'Kitchen Remodeling',
//       description: 'Complete kitchen renovation with custom cabinets, countertops, and modern appliances.',
//       price: '$15,000'
//     },
//     {
//       id: 'bath-ren',
//       imageSrc: 'https://placehold.co/400x300/e0f2f7/007bff?text=Bathroom',
//       altText: 'Bathroom Renovation',
//       title: 'Bathroom Renovation',
//       description: 'Transform your bathroom with new fixtures, tiles, and modern designs.',
//       price: '$8,000'
//     },
//     {
//       id: 'base-fin',
//       imageSrc: 'https://placehold.co/400x300/fff3e0/ff9800?text=Basement',
//       altText: 'Basement Finishing',
//       title: 'Basement Finishing',
//       description: 'Convert your basement into a functional living space, home theater, or gym.',
//       price: '$20,000'
//     },
//     {
//         id: 'Venue Booking',
//         imageSrc: 'https://placehold.co/400x300/e0e7ff/3f51b5?text=Venue Booking',
//         altText: 'Venue Booking',
//         title: 'Venue Booking',
//         description: 'Banquet halls, outdoor venues, resorts, destination wedding locations',
//         price: '$15,000'
//       },
//       {
//         id: 'Event Planning & Coordination',
//         imageSrc: 'https://placehold.co/400x300/e0f2f7/007bff?text=Event Planning & Coordination',
//         altText: 'Event Planning & Coordination',
//         title: 'Event Planning & Coordination',
//         description: 'Wedding planner, day-of coordinator, logistics management',
//         price: '$8,000'
//       },
//       {
//         id: 'Photography & Videography',
//         imageSrc: 'https://placehold.co/400x300/fff3e0/ff9800?text=Basement',
//         altText: 'Photography & Videography',
//         title: 'Photography & Videography',
//         description: 'Pre-wedding shoot, candid photography, cinematic wedding films, drone coverage',
//         price: '$20,000'
//       }
//   ];

// import React from 'react'

// function Subservices() {
//   return (
//     <div>
//        <section className="py-16 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center">
//                         <h2 className="text-3xl font-extrabold text-gray-900">Our Renovation Services</h2>
//                         <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//                             Comprehensive renovation solutions for every part of your home
//                         </p>
//                     </div>

//                     <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                         {/* Map over the services array to render each service card dynamically */}
//                         {services.map((service) => (
//                             <div key={service.id} className="bg-white overflow-hidden shadow-lg rounded-lg">
//                                 <div className="h-48 w-full overflow-hidden">
//                                     <img
//                                         src={service.imageSrc}
//                                         alt={service.altText}
//                                         className="w-full h-full object-cover"
//                                         // Fallback in case image fails to load
//                                         onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/cccccc/000000?text=Image+Error"; }}
//                                     />
//                                 </div>
//                                 <div className="p-6">
//                                     <h3 className="text-xl font-semibold text-gray-900">
//                                         {service.title}
//                                     </h3>
//                                     <p className="mt-2 text-gray-600">
//                                         {service.description}
//                                     </p>
//                                     <p className="mt-4 font-medium text-yellow-600">
//                                         Starting at {service.price}
//                                     </p>
//                                     <button className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
//                                         Learn More
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>
//     </div>
//   )
// }

// export default Subservices

import { servicesData } from "./Services-data"

function Subservices({ serviceType, className = "" }) {
  // Get the data for the specified service type
  const currentServiceData = servicesData[serviceType]

  // Fallback if service type doesn't exist
  if (!currentServiceData) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Service type "{serviceType}" not found.</p>
        </div>
      </div>
    )
  }

  const { title, description, services } = currentServiceData

  return (
    <div className={className}>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">{description}</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={service.imageSrc || "/placeholder.svg"}
                    alt={service.altText}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://placehold.co/400x300/cccccc/000000?text=Image+Error"
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="mt-2 text-gray-600">{service.description}</p>
                  <p className="mt-4 font-medium text-yellow-600">Starting at {service.price}</p>
                  <button className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Subservices
