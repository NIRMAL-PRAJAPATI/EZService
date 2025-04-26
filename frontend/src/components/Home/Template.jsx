import React, { useEffect, useState } from 'react'
import axios from "axios"

function Template() {
  const [templates, setTemplates] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(()=>{
    axios.get("http://localhost:3000/template/").then(response=>{
      setTemplates(response.data)
    }).catch((err)=>{
      console.log(err)
    })
  }, [])
  return (
    <>
    {templates.map((template)=>
    
    <section className="bg-white py-12">
        <div className="mx-4 md:mx-8">
          {/* <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Explore Template categories
          </h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Wedding Requisites Section */}
            <div className="bg-gray-50 rounded-lg border border-gray-300 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Wedding Requisites
              </h2>
              <p className="text-gray-500 -mt-1 mb-4 text-sm">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Labore, unde.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {/* Banquet Halls */}
                {template.categories.map((service) => 
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src={service.image}
                      alt="Banquet Halls"
                      className="w-full h-23 lg:h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    {service.name}
                  </span>
                </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    )}
    </>
  )
}

export default Template