import { MapIcon } from 'lucide-react'
import React from 'react'

function Map() {
  return (
    <section>
                <section className="py-8">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-gray-800 sm:text-4xl text-center mb-5">Find Us</p>
                        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                            {/* Replace with actual map embed code */}
                            <div className="text-center">
                                <MapIcon className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                                <p className="text-gray-600">Interactive map would be embedded here</p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
  )
}

export default Map