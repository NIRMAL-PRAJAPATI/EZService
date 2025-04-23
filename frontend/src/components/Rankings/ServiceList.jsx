"use client"

import { X } from "lucide-react"

const ServiceList = ({ isOpen, onClose }) => {
  const services = ["Home Cleaning", "Trainer", "Plumbing", "Mechanic", "Education", "Laboure", "Beauty & Wellness"]

  return (
    <section className={`absolute bg-black/30 z-10 w-full h-full ${isOpen ? "" : "hidden"}`}>
      <div className="bg-indigo-500 text-white h-full w-3/4 md:w-1/4 ml-auto p-2 border overflow-y-scroll">
        <X className="ml-auto text-white cursor-pointer text-xl" onClick={onClose} />
        <ul className="space-y-1 tracking-wider pl-2">
          {services.map((service, index) => (
            <li key={index} className="border-b border-indigo-500 hover:border-gray-300 p-1 cursor-pointer">
              {service}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ServiceList
