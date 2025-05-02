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
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0199586248763!2d-122.42067968468137!3d37.77492977975924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7e4e58ef%3A0x835e9a7602e3a6b4!2sSan+Francisco%2C+CA%2C+USA!5e0!3m2!1sen!2sin!4v1610000000000"
                            className='w-full h-full'
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Map