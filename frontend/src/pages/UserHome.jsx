import React, { useEffect, useState } from "react";
import HeroSection from "../components/Home/HeroSection";
import Services from "../components/Home/Services";
import UserReview from "../components/Home/UserReview";
import Category from "../components/Home/Category";
import Search from "../components/Home/Search";
import TopCity from "../components/Home/TopCity";
import Sponser from "../components/Home/Sponser";
import Template from "../components/Home/Template";
import LRAlert from "../components/Home/LRAlert";
import Card from "../components/Home/Cards";
import api from "../config/axios-config";
import Loading from "../components/Loading";

function UserHome() {

  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [verifiedServices, setVerifiedServices] = useState([])
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cityServices, setCityServices] = useState([])
  const [city, setCity] = useState('ahmedabad')

  
  
  useEffect(()=>{
    
    // condition to be added if logged in then not to show this
    if(!localStorage.getItem('city'))
          api.get("/user/city/get").then((response)=>{
        localStorage.setItem('city',response.data)
      }).catch((err)=>{
          const city = prompt("Please enter your city:")
          localStorage.setItem('city',city)
      })
    setCity(localStorage.getItem('city')? localStorage.getItem('city'): 'ahmedabad')

    // loading setup
    Promise.all([
      api.get(`/category/names`),
      api.get(`/services/?limit=5`),
      api.get("/services/verified"),
      api.get("/template/?limit=2"),
      api.get('/services/?limit=10')
    ]).then(([categoryNames, servicesData, vServiceData, templateData, cityServiceData])=>{
      setCategories(categoryNames.data)
      setServices(servicesData.data);
      setVerifiedServices(vServiceData.data)
      setTemplates(templateData.data)
      setCityServices(cityServiceData.data)
      }).catch((err) => {
        console.log(err);
      }).finally(()=>{
        setIsLoading(false)
      })
  },[])
  
  if(isLoading)
    return <Loading />

  return (
    <div className="bg-gray-50">
      {/* <HeroSection /> */}
      {/* <Search /> */}
      <Category categories={categories} />
      <Services services={services}/>
      {/* <div className="p-5 container mx-auto">
      <div className="bg-indigo-500/80 rounded-xl shadow-lg overflow-hidden flex w-full sm:h-100">
      <div className="p-8 flex flex-col justify-center sm:w-1/2">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2">
          Air Conditioner Service / Repair
        </h2>
        <p className="text-lg text-gray-200 mb-6">Home Appliences</p>
        <button className="border text-white px-6 py-2 rounded-lg w-fit hover:bg-gray-50/20 transition">
          Explore
        </button>
      </div>
      <div className="w-1/2 hidden sm:block">
        <img
          src="https://static.wixstatic.com/media/ade29c_24e1ba8f67a241b5a6a44f04a96fdbd0~mv2.png/v1/fill/w_556,h_366,fp_0.50_0.50,q_85,usm_0.66_1.00_0.01,enc_auto/ade29c_24e1ba8f67a241b5a6a44f04a96fdbd0~mv2.png"
          alt="Home Painting Room"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
    </div> */}

<Card services={cityServices} city={city}/>

    {/* <div className="p-5 container mx-auto">
      <div className="bg-indigo-500/80 rounded-xl shadow-lg overflow-hidden flex w-full sm:h-100">
      <div className="w-1/2 hidden sm:block">
        <img
          src="https://www.shutterstock.com/image-photo/authentic-indian-food-snacks-close-260nw-1960332085.jpg"
          alt="Home Painting Room"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-8 flex flex-col justify-center sm:w-1/2">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-2">
          Just need to Find Best Cataring Services
        </h2>
        <p className="text-lg text-gray-200 mb-6">Catering Service</p>
        <button className="border text-white px-6 py-2 rounded-lg w-fit hover:bg-gray-50/20 transition">
          Explore
        </button>
      </div>
    </div>
    </div> */}
      <TopCity />
      {/* <Card /> */}
      <Sponser services={verifiedServices}/>
      <Template templates={templates}/>
      <UserReview />
      <LRAlert />
    </div>
  );
}

export default UserHome;
