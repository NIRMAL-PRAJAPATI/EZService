import React, { useEffect, useState } from 'react'
import axios from "axios"


function Category() {
  const [categories, setCategories] = useState([]) // {}
  const api = 'http://localhost:3000'

  useEffect(()=>{
    axios.get(`${api}/category/names`).then(response=>{
      setCategories(response.data)
      console.log(response.data)
    }).catch((err)=>{
      console.log(err)
    })
  },[])

  return (
    
    <section className="py-5 text-black">
    <div className="px-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 w-max">
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