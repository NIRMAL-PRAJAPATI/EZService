import React, { useEffect, useState } from "react";
import HeroSection from "../components/Home/HeroSection";
import Services from "../components/Home/Services";
import UserReview from "../components/Home/UserReview";
import Category from "../components/Home/Category";
import TopCity from "../components/Home/TopCity";
import Sponser from "../components/Home/Sponser";
import Template from "../components/Home/Template";
import LRAlert from "../components/Home/LRAlert";
import Card from "../components/Home/Cards";
import api from "../config/axios-config";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";

function UserHome() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [verifiedServices, setVerifiedServices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cityServices, setCityServices] = useState([]);
  const [city, setCity] = useState("ahmedabad");
  const [tokenCheck, setTokenCheck] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("city")) {
      api.get("/user/city/get")
        .then((response) => {
          localStorage.setItem("city", response.data);
          setCity(response.data);
        })
        .catch(() => {
          setCity("ahmedabad");
        });
    } else {
      setCity(localStorage.getItem("city") || "ahmedabad");
    }

    Promise.all([
      api.get(`/category/names`),
      api.get(`/services/?limit=5`),
      api.get("/services/verified"),
      api.get("/template/?limit=2"),
      api.get("/services/?limit=10"),
    ])
      .then(([categoryNames, servicesData, vServiceData, templateData, cityServiceData]) => {
        setCategories(categoryNames.data);
        setServices(servicesData.data);
        setVerifiedServices(vServiceData.data);
        setTemplates(templateData.data);
        setCityServices(cityServiceData.data);
      })
      .catch((err) => {
        console.error("Error fetching home data:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const token = localStorage.getItem("token");
    setTokenCheck(!!token);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Bar */}
      <Category categories={categories} />

      {/* Featured Services */}
      <Services services={services} />

      {/* City Services */}
      <Card services={cityServices} city={city} />

      {/* Promotional Banner */}
      <section className="py-8 px-4 sm:px-6 container mx-auto">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl shadow-lg overflow-hidden border border-indigo-800/40 grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 sm:p-12 flex flex-col justify-center text-white">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full w-fit mb-3">
              Specialized Service
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Need Event & Catering Solutions?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
              From family gatherings to grand wedding events, connect with verified catering and party specialists easily.
            </p>
            <div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-white text-indigo-950 font-bold px-6 py-3 rounded-lg text-sm hover:bg-gray-100 transition shadow-sm"
              >
                <span>Explore Event Services</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative h-full min-h-[260px] bg-slate-800">
            <img
              src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80"
              alt="Catering and Event Services"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/60 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <TopCity />

      {/* Verified / Sponsored Pros */}
      <Sponser services={verifiedServices} />

      {/* Curated Packages / Templates */}
      <Template templates={templates} />

      {/* Customer Testimonials */}
      <UserReview />

      {/* Login / Register Alert Banner (for guest users) */}
      {!tokenCheck && <LRAlert />}
    </div>
  );
}

export default UserHome;
