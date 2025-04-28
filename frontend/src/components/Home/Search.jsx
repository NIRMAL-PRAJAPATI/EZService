import { SearchIcon } from 'lucide-react'
import React from 'react'

function Search() {
  return (
    <div className="max-w-3xl mb-5 px-5 mx-auto text-black">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full px-4 py-3 bg-transparent border-b border-gray-500 focus:border-indigo-500 focus:outline-none"
                />
                <button className="text-gray-400">
                  <SearchIcon className="text-xl mt-2" />
                </button>
              </div>
            </div>
  )
}

export default Search