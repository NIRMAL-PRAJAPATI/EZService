import React from 'react'

function Category() {
  return (
    
    <section className="py-5 text-black">
    <div className="px-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 w-max">
          <button
            type="submit"
            className="w-[200px] p-5 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:border-indigo-500 border border-gray-300"
          >
            Plumbing
          </button>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Category