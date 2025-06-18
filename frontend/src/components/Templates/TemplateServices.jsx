import React from 'react';
import { Link } from "react-router-dom";

const templateData = [
  {
    title: "Home Renovation",
    description: "Professional home renovation services and templates",
    to: "/home-renovation",
  },
  {
    title: "Wedding Requisites",
    description: "Complete wedding planning and service templates",
    to: "/wedding-requisites",
  },
  {
    title: "Home Appliances",
    description: "Installation and repair service templates",
    to: "/HomeAppliance",
  },
  {
    title: "Beauty & Spa",
    description: "Beauty and wellness service templates",
    to: "/BeautySpa",
  },
  {
    title: "Party Things",
    description: "Event planning and party service templates",
    to: "/Party",
  }
];

const TemplateServices = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Templates</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templateData.map((template, index) => {
            const TemplateContent = (
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{template.title}</h2>
                <p className="text-gray-600">{template.description}</p>
              </div>
            );

            return template.to ? (
              <Link to={template.to} key={index} className="block">
                {TemplateContent}
              </Link>
            ) : (
              <div key={index}>
                {TemplateContent}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateServices;
