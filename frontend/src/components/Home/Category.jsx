import React, { useEffect, useRef, useState } from 'react'
import api from "../../config/axios-config"

function Category({categories}) {

  return (
    
    <section className="p-5 mx-auto container text-black">
    <div>
      <div className="overflow-x-auto">
        <div className="flex justify-center align-middle space-x-2 w-max">
          {categories?.map((category) => (
          <button
            type="submit"
            key={category.id}
            className="flex cursor-pointer py-3 px-6 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:border-indigo-500 border border-gray-200 truncate"            
            >{category.name}</button>
        ))}
        </div>
      </div>
    </div>
  </section>
  )
}

export default Category