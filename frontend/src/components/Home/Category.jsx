import React, { useEffect, useRef, useState } from 'react'
import api from "../../config/axios-config"
import { Link } from 'react-router-dom'

function Category({categories}) {

  return (
    
    <section className="pt-5 px-2 mx-auto text-black">
    <div>
      <div className="overflow-x-auto removeScroll">
        <div className="flex justify-center align-middle space-x-2 w-max">
          {categories?.map((category) => (
            <Link to={`/services/${category.id}`} key={category.id}>
          <button
            type="submit"
            key={category.id}
            className="flex cursor-pointer py-2 px-4 bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow hover:border-indigo-500 border border-gray-200 truncate"            
            >{category.name}</button>
            </Link>
        ))}
        </div>
      </div>
    </div>
  </section>
  )
}

export default Category