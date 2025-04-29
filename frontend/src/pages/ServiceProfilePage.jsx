import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { BadgeCheck, ShieldIcon as ShieldUser, ArrowUpIcon as ClockArrowUp, Briefcase, MapPin, CircleAlert, Star } from 'lucide-react';
import api from "../config/axios-config"
import Loading from '../components/Loading';

const ServiceProfilePage = () => {
  // This data would typically come from props or an API call
  const [serviceData, setServiceData] = useState({})  
  const [isLoading, setIsLoading] = useState(true)
  const {id} = useParams()
  const [reviews, setReviews] = useState([])

  useEffect(()=>{
    console.log(id)
    api.get(`/services/${id}`).then((response)=>{
      setServiceData(response.data)
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      setIsLoading(false)
    })

    api.get(`/reviews/service/${id}/`).then((response)=>{
      setReviews(response.data)    
    }).catch((err)=>{
      console.log(err)
    })
  },[])


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

  if(isLoading)
    return <Loading />
  return (
    <div className="bg-gray-50">
      <main className="p-2 sm:p-8 bg-white shadow-lg rounded-lg md:my-5 mx-auto border border-dashed border-indigo-500 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <img 
            src={serviceData?.cover_image || "/placeholder.svg"} 
            alt={serviceData?.name} 
            className="w-60 h-60 object-contain"
          />
          <div>
            <h2 className="flex text-3xl md:text-4xl font-bold text-gray-800">
              {serviceData?.name} 
              <p className="mt-3">
                {serviceData?.badge_status && (
                  <span className="flex bg-indigo-500/80 text-white ml-2 px-2 py-1 rounded text-xs">
                    <BadgeCheck className="h-4 w-4" />
                    Verifed
                  </span>
                )}
              </p>
            </h2>
            <p className="flex text-gray-500">{serviceData?.ServiceCategory?.name}</p>
            <div className="mt-4 space-y-1 text-indigo-500">
              <div className="flex items-center gap-1">
                <ShieldUser className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">
                  {serviceData?.ProviderInfo?.name}
                  <span className="text-[9px]"> (Provider)</span>
                </p>
              </div>
              <div className="flex items-center gap-1">
                <ClockArrowUp className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">
                  <span>{serviceData?.fulfillments || 0}</span>+ Fullfilled Service Requiests
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">
                  <span>{serviceData?.experience || 0}</span>+ Years of Experiance
                </p>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4" />
                <p className="text-gray-800 tracking-wide text-sm">{serviceData?.locations?.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5">
          <p className="text-gray-600 leading-relaxed">{serviceData?.description}</p>
        </section>

        <section className="mt-3 flex">
          <p className="text-indigo-500 font-bold text-2xl">₹ {serviceData?.visiting_charge}</p>
          <div onClick={handleTermsClick} className="cursor-pointer">
            <CircleAlert className="h-3 w-5 mt-3 text-gray-500" />
          </div>
        </section>

        <section className="mt-2 gap-1 space-y-1 sm:space-y-0 sm:flex">
          <button 
            onClick={handleGetService}
            className="px-3 py-2 border bg-indigo-500 text-white tracking-wide font-medium rounded"
          >
            Get Service
          </button>
          <button 
            onClick={handleChat}
            className="px-3 py-2 border border-indigo-500 text-indigo-500 tracking-wide font-medium rounded"
          >
            Chat with Service Provider
          </button>
        </section>

        <section className="mt-8">
          <h3 className="text-xl font-bold text-gray-800">Services Provided</h3>
          <ul className="list-disc pl-6 mt-3 text-gray-700 space-y-1">
            {serviceData?.specifications?.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </section>

        <section className="my-5">
          <h3 className="text-xl font-bold text-gray-800 flex mb-3">Working Images</h3>
          <div className="flex gap-4 w-full overflow-x-scroll">
            {serviceData?.working_images?.map((image, index) => (
              <img 
                key={index}
                src={image || "/placeholder.svg"} 
                alt={`Work sample ${index + 1}`}
                className="rounded border border-gray-300 hover:border-indigo-500 h-60 w-60 object-contain bg-gray-50"
              />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="sm:flex">
            <h3 className="text-xl font-bold text-gray-800 flex">Customer Exploration</h3>
            <div className="flex items-center text-indigo-500 gap-1 ml-3 mt-1 rounded">
              {[...Array(Math.floor(serviceData?.average_rating))]?.map((rate)=> <Star className="h-5 w-5 fill-indigo-500 inline-block" />)}
              {[...Array(5-Math.floor(serviceData?.average_rating))]?.map((rate)=> <Star className="h-5 w-5 inline-block" />)}
            </div>
          </div>
          
          <table className="w-full sm:w-[50vw] border my-5">
            <tbody>
              {/* {Object.entries(serviceData?.metrics)?.map(([key, value], index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{key}</td>
                  <td className="border border-gray-300 px-4 py-2">{value}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
          
          <div className="mt-4 space-y-4">
            {reviews?.map((review, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded">
                <p className="font-semibold justify-between flex">
                  {review.name} <span className="text-gray-800 text-sm">{review.created}</span>
                </p>
                <p className="text-gray-900 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServiceProfilePage;
