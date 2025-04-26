"use client"

import { useEffect, useState } from "react"
import axios from "axios"

function Template() {
  const [templates, setTemplates] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3000/template/?limit=2")
      .then((response) => {
        setTemplates(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-8x1">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore Template Categories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map((template, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h2>
                  <p className="text-gray-600 mb-6 text-sm">{template.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {template.categories.map((category, catIndex) => (
                      <div key={catIndex} className="group cursor-pointer">
                        <div className="rounded-lg overflow-hidden mb-3 shadow-sm hover:shadow transition-all duration-300 aspect-[4/3]">
                          <img
                            src={category.cover_image || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <span className="text-sm font-medium text-center block text-gray-800 group-hover:text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Template
