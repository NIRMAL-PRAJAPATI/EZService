import React, { useEffect, useState } from 'react'
import api from "../../config/axios-config"

function Category() {
  const [categories, setCategories] = useState([]) 

  useEffect(()=>{
    api.get(`/category/names`).then(response=>{
      setCategories(response.data)
      console.log(response.data)
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  return (
    
    <section className="p-5 mx-auto container text-black">
    <div>
      <div className="overflow-x-auto">
        <div className="flex justify-center align-middle space-x-2 w-max">
          {categories.map((category) => (
          <button
            type="submit"
            key={category.id}
            className="flex cursor-pointer py-3 px-6 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:border-indigo-500 border border-gray-200 truncate">{category.name}</button>
        ))}
        </div>
      </div>
    </div>
  </section>
  )
}

export default Category