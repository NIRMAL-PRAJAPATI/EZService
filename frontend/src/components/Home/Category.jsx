import React from 'react'

function Category() {
  const categories = ["Plumbing", "Home Cleaning", "Trainer", "Electritian", "Laboure", "Servant"
  ]

  return (
    
    <section className="py-5 text-black">
    <div className="px-4">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 w-max">
          {categories.map((category) => (
          <button
            type="submit"
            className="flex cursor-pointer py-3 px-6 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:border-indigo-500 border border-gray-200 truncate">{category}</button>
        ))}
        </div>
      </div>
    </div>
  </section>
  )
}

export default Category