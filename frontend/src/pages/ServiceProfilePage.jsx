import React from 'react';
import { BadgeCheck, ShieldIcon as ShieldUser, ArrowUpIcon as ClockArrowUp, Briefcase, MapPin, CircleAlert, Star } from 'lucide-react';

const ServiceProfilePage = () => {
  // This data would typically come from props or an API call
  const serviceData = {
    name: "Ananta Plumbing Service",
    verified: true,
    category: "Plumbing",
    provider: "Ananta services",
    fulfillments: 36,
    experience: 7,
    location: "Borivali, Mumbai",
    description: "John Doe has been providing top-notch plumbing services for over a decade, specializing in residential and commercial repairs, installations, and maintenance. His expertise and customer-centric approach ensure high-quality service and client satisfaction.",
    price: "₹500",
    imageUrl: "https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg",
    services: [
      "Pipe Repairs & Replacements",
      "Leak Detection & Fixing",
      "Water Heater Installation",
      "Drain Cleaning & Unclogging",
      "Bathroom & Kitchen Plumbing"
    ],
    workImages: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVcFW8lNjtpqmpycJa7r6kMCwDnlA3ENZixQ&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7-YwRHKB0WanH5M8gU7p_wPAGs8wTo-UtCA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn9ojTRpCJD-gZNwBgalvvomyQBluEBqpzzA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnVe9FuGRsNWJThJPN1PhWqr_VT0Tv8HrhFA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSShIJMLgaSUzZOYs4kfL4mh2v7_onGECPyxg&s"
    ],
    rating: 4,
    metrics: {
      "Customer Setisfaction": "98%",
      "Service Reliability": "57%",
      "Response Time": "85%"
    },
    reviews: [
      {
        name: "Jane Smith",
        date: "Jan - 2024",
        comment: "\"John was professional, on time, and fixed our plumbing issue quickly. Highly recommend!\""
      }
    ]
  };

  const handleGetService = () => {
    // Handle service request logic
    console.log("Service requested");
  };

  const handleChat = () => {
    // Handle chat initiation logic
    console.log("Chat initiated");
  };

  const handleTermsClick = () => {
    // Handle terms and conditions click
    console.log("Terms and conditions clicked");
  };

  return (
    <div className="bg-gray-50">
      <main className="p-2 sm:p-8 bg-white shadow-lg rounded-lg md:my-5 mx-auto border border-dashed border-primary max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img 
            src={serviceData.imageUrl || "/placeholder.svg"} 
            alt="Service Provider" 
            className="w-60 h-60 object-contain"
          />
          <div>
            <h2 className="flex text-3xl md:text-4xl font-bold text-gray-800">
              {serviceData.name} 
              <p className="mt-3">
                {serviceData.verified && (
                  <span className="flex bg-primary/80 text-white ml-2 px-2 py-1 rounded text-xs">
                    <BadgeCheck className="h-4 w-4" />
                    Verifed
                  </span>
                )}
              </p>
            </h2>
            <p className="flex text-gray-500">{serviceData.category}</p>
            <div className="mt-4 space-y-1 text-primary">
              <div className="flex items-center gap-1">
                <ShieldUser className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">
                  {serviceData.provider}
                  <span className="text-[9px]"> (Provider)</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ClockArrowUp className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">
                  <span>{serviceData.fulfillments}</span>+ Fullfilled Service Requiests
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">
                  <span>{serviceData.experience}</span>+ Years of Experiance
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">{serviceData.location}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5">
          <p className="text-gray-600 leading-relaxed">{serviceData.description}</p>
        </section>

        <section className="mt-3 flex">
          <p className="text-primary font-bold text-2xl">{serviceData.price}</p>
          <div onClick={handleTermsClick} className="cursor-pointer">
            <CircleAlert className="h-3 w-5 mt-3 text-gray-500" />
          </div>
        </section>

        <section className="mt-2 gap-1 space-y-1 sm:space-y-0 sm:flex">
          <button 
            onClick={handleGetService}
            className="px-3 py-2 border bg-primary text-white tracking-wide font-medium rounded"
          >
            Get Service
          </button>
          <button 
            onClick={handleChat}
            className="px-3 py-2 border border-primary text-primary tracking-wide font-medium rounded"
          >
            Chat with Service Provider
          </button>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">Services Provided</h3>
          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-1">
            {serviceData.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </section>

        <section className="my-5">
          <h3 className="text-xl font-bold text-gray-800 flex mb-3">Working Images</h3>
          <div className="flex gap-4 w-full overflow-x-scroll">
            {serviceData.workImages.map((image, index) => (
              <img 
                key={index}
                src={image || "/placeholder.svg"} 
                alt={`Work sample ${index + 1}`}
                className="rounded border hover:border-primary h-60 w-60 object-contain bg-gray-50"
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="sm:flex">
            <h3 className="text-xl font-bold text-gray-800 flex">Customer Exploration</h3>
            <div className="flex items-center text-primary gap-1 ml-3 mt-1 rounded">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-5 w-5 ${i < serviceData.rating ? "fill-primary" : ""} inline-block`}
                />
              ))}
            </div>
          </div>
          
          <table className="w-full sm:w-[50vw] border my-5">
            <tbody>
              {Object.entries(serviceData.metrics).map(([key, value], index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{key}</td>
                  <td className="border border-gray-300 px-4 py-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 space-y-4">
            {serviceData.reviews.map((review, index) => (
              <div key={index} className="p-4 border rounded bg-gray-50 shadow-sm">
                <p className="font-semibold text-gray-800 justify-between flex">
                  {review.name} <span className="text-gray-500 text-sm">{review.date}</span>
                </p>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceProfilePage;
