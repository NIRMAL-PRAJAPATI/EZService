import React from 'react'

function Growth() {
  return (
    <section className="bg-gray-50 pt-10 pb-1 text-black">
                <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold text-center mb-16">
                    Change Lifestyle
                    <span className="block text-indigo-500 text-3xl md:text-6xl">Those Who've Made Life Easy</span>
                </h1>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 star_grid">
                    {/* Companies */}
                    <div className="text-center">
                        <p className="text-indigo-500 text-md">Users</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-1 " data-val={600}>455</h2>
                        <p className="text-gray-500 text-sm">Growing Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-indigo-500 text-md">Services Available</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-1" data-val={25}>47</h2>
                        <p className="text-gray-500 text-sm">Available now</p>
                    </div>
                    {/* Templates */}
                    <div className="text-center">
                        <p className="text-indigo-500 text-md">Fullfilled Services</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-1" data-val={500}>64</h2>
                        <p className="text-gray-500 text-sm">by EZService till now</p>
                    </div>
                    {/* Ratings */}
                    <div className="text-center">
                        <p className="text-indigo-500 text-md">Ratings</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-1">4.5/5</h2>
                        <p className="text-gray-500 text-sm">In Industry</p>
                    </div>
                </div>
            </section>
  )
}

export default Growth