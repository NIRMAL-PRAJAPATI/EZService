import React, { useEffect, useRef, useState } from 'react'
import api from "../../config/axios-config"
import { Link } from 'react-router-dom'

function Category({categories}) {

  return (
    
    <section className="p-2 mx-auto bg-indigo-500">
    <div>
      <div className="overflow-x-auto removeScroll">
        <div className="flex justify-center align-middle space-x-1 w-max">
          {categories?.map((category) => (
            <Link to={`/services/${category.id}`} key={category.id}>
          <button
            type="submit"
            key={category.id}
            className="flex cursor-pointer py-1 px-3 text-sm transition-shadow hover:border-indigo-300 truncate tracking-wide text-white/90 hover:text-white"            
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