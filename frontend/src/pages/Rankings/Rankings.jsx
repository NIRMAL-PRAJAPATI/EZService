import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { BsList } from 'react-icons/bs';
import { IoIosArrowDown } from 'react-icons/io';
import './Rankings.css';

// ServiceList Component
const ServiceList = ({ isOpen, onClose }) => {
  const services = [
    'Home Cleaning',
    'Trainer',
    'Plumbing',
    'Mechanic',
    'Education',
    'Laboure',
    'Beauty & Wellness'
  ];

  return (
    <section className={`absolute bg-black/30 z-10 w-full h-full ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-primary text-white h-full w-3/4 md:w-1/4 ml-auto p-2 border overflow-y-scroll">
        <IoClose 
          className="ml-auto text-white cursor-pointer text-xl" 
          onClick={onClose}
        />
        <ul className="space-y-1 tracking-wider pl-2">
          {services.map((service, index) => (
            <li key={index} className="border-b border-primary hover:border-gray-300 p-1 cursor-pointer">
              {service}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

// RankCard Component
const RankCard = ({ position, name, location, imageUrl, metrics }) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-5">
      <div className="md:flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="absolute px-3 py-1 text-white font-bold bg-primary text-[12px] tracking-wide transform rotate-badge -mt-5 md:mt-0 md:mb-24 -ml-8 border-2 border-dashed border-white">
          {position} Position
        </p>
        <div className="flex h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
          <img 
            src={imageUrl}
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600 text-sm">{location}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-5 mt-4">
            {Object.entries(metrics).map(([key, value], index) => (
              <div key={index} className="flex justify-between text-sm border-b border-primary">
                <span>{key}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Rankings = () => {
  const [isServiceListOpen, setIsServiceListOpen] = useState(false);

  const rankingsData = [
    {
      position: '1st',
      name: 'Premium Cleaning Services',
      location: 'Ahmedabad, Gujarat, India',
      imageUrl: 'https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg',
      metrics: {
        'Customer Satisfaction': '98%',
        'Service Reliability': '95%',
        'Response Time': '92%'
      }
    },
    {
      position: '2nd',
      name: 'Ananta Plumbing Service',
      location: 'Ahmedabad, Gujarat, India',
      imageUrl: 'https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg',
      metrics: {
        'Customer Satisfaction': '98%',
        'Service Reliability': '95%',
        'Response Time': '92%'
      }
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <ServiceList 
        isOpen={isServiceListOpen} 
        onClose={() => setIsServiceListOpen(false)} 
      />

      <div className="max-w-7xl mx-auto p-2 z-0">
        {/* Header Section */}
        <div className="flex justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Service Rankings</h1>
          <button 
            onClick={() => setIsServiceListOpen(true)}
            className="flex items-center border py-2 px-3 rounded tracking-wide bg-primary text-white"
          >
            <BsList className="mr-1" />
            List
          </button>
        </div>

        {/* Rankings List */}
        <div className="space-y-4">
          {rankingsData.map((ranking, index) => (
            <RankCard 
              key={index}
              {...ranking}
            />
          ))}
        </div>
      </div>

      {/* Load More Button */}
      <button className="flex mx-auto text-center mt-4 text-primary font-semibold items-center">
        Load More 
        <IoIosArrowDown className="ml-1 mt-0.5" />
      </button>
    </div>
  );
};

export default Rankings; 