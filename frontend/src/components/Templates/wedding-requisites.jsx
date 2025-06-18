// import React from 'react'
// import HomeRenovation from './home-renovation'
// const services = [
//   {
//     id: 'Venue Booking',
//     imageSrc: 'https://placehold.co/400x300/e0e7ff/3f51b5?text=Venue Booking',
//     altText: 'Venue Booking',
//     title: 'Venue Booking',
//     description: 'Banquet halls, outdoor venues, resorts, destination wedding locations',
//     price: '$15,000'
//   },
//   {
//     id: 'Event Planning & Coordination',
//     imageSrc: 'https://placehold.co/400x300/e0f2f7/007bff?text=Event Planning & Coordination',
//     altText: 'Event Planning & Coordination',
//     title: 'Event Planning & Coordination',
//     description: 'Wedding planner, day-of coordinator, logistics management',
//     price: '$8,000'
//   },
//   {
//     id: 'Photography & Videography',
//     imageSrc: 'https://placehold.co/400x300/fff3e0/ff9800?text=Basement',
//     altText: 'Photography & Videography',
//     title: 'Photography & Videography',
//     description: 'Pre-wedding shoot, candid photography, cinematic wedding films, drone coverage',
//     price: '$20,000'
//   }
// ];

// function WeddingRequisites() {
//   return (
//     <div>
//       <div className="min-h-screen bg-white">
//         {/* Hero Section */}
//         <section className="relative bg-gray-900 text-white">
//           <div className="absolute inset-0 overflow-hidden">
//             <img
//               src="/placeholder.svg?height=800&width=1600"
//               alt="Home Renovation"
//               className="w-full h-full object-cover opacity-40"
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
//           </div>
//           <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
//             <div className="md:w-2/3">
//               <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
//                 Transform Your Living Space
//               </h1>
//               <p className="mt-6 text-xl max-w-3xl">
//                 Professional home renovation services for every room in your house. Quality craftsmanship and attention to
//                 detail that exceeds expectations.
//               </p>
//               <div className="mt-10 flex flex-wrap gap-4">
//                 <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-yellow-400 transition-colors">
//                   Get a Free Quote
//                 </button>
//                 <button className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
//                   Our Services
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>

//         <div>
//           <section className="py-16 bg-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="text-center">
//                 <h2 className="text-3xl font-extrabold text-gray-900">Our Renovation Services</h2>
//                 <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//                   Comprehensive renovation solutions for every part of your home
//                 </p>
//               </div>

//               <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                 {/* Map over the services array to render each service card dynamically */}
//                 {services.map((service) => (
//                   <div key={service.id} className="bg-white overflow-hidden shadow-lg rounded-lg">
//                     <div className="h-48 w-full overflow-hidden">
//                       <img
//                         src={service.imageSrc}
//                         alt={service.altText}
//                         className="w-full h-full object-cover"
//                         // Fallback in case image fails to load
//                         onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/cccccc/000000?text=Image+Error"; }}
//                       />
//                     </div>
//                     <div className="p-6">
//                       <h3 className="text-xl font-semibold text-gray-900">
//                         {service.title}
//                       </h3>
//                       <p className="mt-2 text-gray-600">
//                         {service.description}
//                       </p>
//                       <p className="mt-4 font-medium text-yellow-600">
//                         Starting at {service.price}
//                       </p>
//                       <button className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
//                         Learn More
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* Process Section */}
//         <section className="py-16 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center">
//               <h2 className="text-3xl font-extrabold text-gray-900">Our Renovation Process</h2>
//               <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//                 We follow a proven process to ensure your renovation project is completed on time and within budget
//               </p>
//             </div>

//             <div className="mt-12">
//               <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//                 {/* Step 1 */}
//                 <div className="relative">
//                   <div className="absolute top-0 left-0 -ml-4 mt-2 hidden lg:block">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white font-bold">
//                       1
//                     </span>
//                   </div>
//                   <div className="bg-white p-6 rounded-lg shadow-md h-full">
//                     <div className="lg:ml-4">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation</h3>
//                       <p className="text-gray-600">
//                         We meet to discuss your vision, requirements, and budget for the renovation project.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Step 2 */}
//                 <div className="relative">
//                   <div className="absolute top-0 left-0 -ml-4 mt-2 hidden lg:block">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white font-bold">
//                       2
//                     </span>
//                   </div>
//                   <div className="bg-white p-6 rounded-lg shadow-md h-full">
//                     <div className="lg:ml-4">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">Design & Planning</h3>
//                       <p className="text-gray-600">
//                         Our designers create detailed plans and 3D renderings of your renovation project.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Step 3 */}
//                 <div className="relative">
//                   <div className="absolute top-0 left-0 -ml-4 mt-2 hidden lg:block">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white font-bold">
//                       3
//                     </span>
//                   </div>
//                   <div className="bg-white p-6 rounded-lg shadow-md h-full">
//                     <div className="lg:ml-4">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">Construction</h3>
//                       <p className="text-gray-600">
//                         Our skilled craftsmen execute the renovation with attention to detail and quality.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Step 4 */}
//                 <div className="relative">
//                   <div className="absolute top-0 left-0 -ml-4 mt-2 hidden lg:block">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white font-bold">
//                       4
//                     </span>
//                   </div>
//                   <div className="bg-white p-6 rounded-lg shadow-md h-full">
//                     <div className="lg:ml-4">
//                       <h3 className="text-xl font-semibold text-gray-900 mb-2">Final Inspection</h3>
//                       <p className="text-gray-600">
//                         We conduct a thorough inspection to ensure everything meets our high standards.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Portfolio Section */}
//         <section className="py-16 bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center">
//               <h2 className="text-3xl font-extrabold text-gray-900">Our Recent Projects</h2>
//               <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//                 Take a look at some of our recently completed renovation projects
//               </p>
//             </div>

//             <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Project 1 */}
//               <div className="group relative overflow-hidden rounded-lg shadow-md">
//                 <img
//                   src="/placeholder.svg?height=400&width=600"
//                   alt="Modern Kitchen Renovation"
//                   className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-end">
//                   <div className="p-4 text-white">
//                     <h3 className="text-lg font-semibold">Modern Kitchen Renovation</h3>
//                     <p className="text-sm">Complete kitchen remodel with custom cabinetry</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Project 2 */}
//               <div className="group relative overflow-hidden rounded-lg shadow-md">
//                 <img
//                   src="/placeholder.svg?height=400&width=600"
//                   alt="Luxury Bathroom Remodel"
//                   className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-end">
//                   <div className="p-4 text-white">
//                     <h3 className="text-lg font-semibold">Luxury Bathroom Remodel</h3>
//                     <p className="text-sm">Spa-inspired bathroom with custom tile work</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Project 3 */}
//               <div className="group relative overflow-hidden rounded-lg shadow-md">
//                 <img
//                   src="/placeholder.svg?height=400&width=600"
//                   alt="Basement Entertainment Room"
//                   className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-end">
//                   <div className="p-4 text-white">
//                     <h3 className="text-lg font-semibold">Basement Entertainment Room</h3>
//                     <p className="text-sm">Finished basement with home theater and bar</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-10 text-center">
//               <button className="bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors">
//                 View All Projects
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Testimonials Section */}
//         <section className="py-16 bg-gray-50">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="text-center">
//               <h2 className="text-3xl font-extrabold text-gray-900">What Our Clients Say</h2>
//               <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
//                 Read testimonials from our satisfied customers
//               </p>
//             </div>

//             <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//               {/* Testimonial 1 */}
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//                 <div className="flex items-center mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className="h-5 w-5 text-yellow-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-gray-700 italic mb-4">
//                   "The renovation team was professional and completed our kitchen remodel on time and within budget. We
//                   couldn't be happier with the results!"
//                 </p>
//                 <div>
//                   <p className="font-semibold text-gray-900">Sarah Johnson</p>
//                   <p className="text-gray-500 text-sm">Kitchen Renovation</p>
//                 </div>
//               </div>

//               {/* Testimonial 2 */}
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//                 <div className="flex items-center mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className="h-5 w-5 text-yellow-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-gray-700 italic mb-4">
//                   "We've used this service for multiple properties and have always been impressed with the quality of work
//                   and attention to detail."
//                 </p>
//                 <div>
//                   <p className="font-semibold text-gray-900">Michael Brown</p>
//                   <p className="text-gray-500 text-sm">Property Manager</p>
//                 </div>
//               </div>

//               {/* Testimonial 3 */}
//               <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
//                 <div className="flex items-center mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <svg
//                       key={i}
//                       className="h-5 w-5 text-yellow-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                     </svg>
//                   ))}
//                 </div>
//                 <p className="text-gray-700 italic mb-4">
//                   "Our bathroom renovation exceeded all expectations. The team was professional, clean, and completed the
//                   work ahead of schedule."
//                 </p>
//                 <div>
//                   <p className="font-semibold text-gray-900">Jennifer Davis</p>
//                   <p className="text-gray-500 text-sm">Bathroom Remodel</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA Section */}
//         <section className="bg-gray-900 text-white py-16">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//             <h2 className="text-3xl font-extrabold">Ready to Transform Your Home?</h2>
//             <p className="mt-4 text-xl max-w-2xl mx-auto">
//               Contact us today to schedule a free consultation and get a quote for your renovation project.
//             </p>
//             <div className="mt-8 flex justify-center space-x-4">
//               <button className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-yellow-400 transition-colors">
//                 Get a Free Quote
//               </button>
//               <button className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:bg-opacity-10 transition-colors">
//                 Contact Us
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Contact Form Section */}
//         <section className="py-16 bg-white">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//               <div>
//                 <h2 className="text-3xl font-extrabold text-gray-900">Contact Us</h2>
//                 <p className="mt-4 text-lg text-gray-500">
//                   Fill out the form and our team will get back to you within 24 hours.
//                 </p>

//                 <div className="mt-8 space-y-6">
//                   <div className="flex items-start">
//                     <div className="flex-shrink-0">
//                       <svg
//                         className="h-6 w-6 text-yellow-500"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3 text-gray-700">
//                       <p className="text-lg font-medium">Phone</p>
//                       <p>(123) 456-7890</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <div className="flex-shrink-0">
//                       <svg
//                         className="h-6 w-6 text-yellow-500"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3 text-gray-700">
//                       <p className="text-lg font-medium">Email</p>
//                       <p>info@homerenovation.com</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start">
//                     <div className="flex-shrink-0">
//                       <svg
//                         className="h-6 w-6 text-yellow-500"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                     </div>
//                     <div className="ml-3 text-gray-700">
//                       <p className="text-lg font-medium">Address</p>
//                       <p>
//                         123 Renovation St, Suite 100
//                         <br />
//                         Anytown, USA 12345
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-gray-50 p-8 rounded-lg shadow-md">
//                 <form>
//                   <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
//                     <div>
//                       <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
//                         First name
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           type="text"
//                           name="first-name"
//                           id="first-name"
//                           className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
//                         Last name
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           type="text"
//                           name="last-name"
//                           id="last-name"
//                           className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
//                         />
//                       </div>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                         Email
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           id="email"
//                           name="email"
//                           type="email"
//                           className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
//                         />
//                       </div>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                         Phone
//                       </label>
//                       <div className="mt-1">
//                         <input
//                           type="text"
//                           name="phone"
//                           id="phone"
//                           className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
//                         />
//                       </div>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <label htmlFor="service" className="block text-sm font-medium text-gray-700">
//                         Service Interested In
//                       </label>
//                       <div className="mt-1">
//                         <select
//                           id="service"
//                           name="service"
//                           className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
//                         >
//                           <option>Kitchen Remodeling</option>
//                           <option>Bathroom Renovation</option>
//                           <option>Basement Finishing</option>
//                           <option>Whole House Renovation</option>
//                           <option>Other</option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//                         Message
//                       </label>
//                       <div className="mt-1">
//                         <textarea
//                           id="message"
//                           name="message"
//                           rows={4}
//                           className="py-3 px-4 block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 border-gray-300 rounded-md"
//                         ></textarea>
//                       </div>
//                     </div>
//                     <div className="sm:col-span-2">
//                       <button
//                         type="submit"
//                         className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
//                       >
//                         Submit Request
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   )
// }

// export default WeddingRequisites
import Services from "./Services"

import React from 'react'

function WeddingRequisites() {
  return (
    <div>
      <Services serviceType="wedding" />
    </div>
  )
}
   
export default WeddingRequisites
