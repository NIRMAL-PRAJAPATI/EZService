import React from 'react'
import resources from '../../resource';

function Process() {
  return (
    <section className="container mx-auto px-4 md:pb-5 relative" id="main_id">
                <h2 className="text-3xl font-bold text-center">How Process go through</h2>
                {/* card 1 */}
                <div className="flex flex-col md:flex-row items-center gap-8 mx-auto bg-white p-7 md:p-10 shadow-lg h-full rounded my-5 border-b hover:border-indigo-500">
                    <div className="w-full md:w-2/3 space-y-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                            Choose Service
                        </h1>
                        <p className="text-gray-600">
                            Find Service is a platform that connects users with professional service providers across various industries. It allows users to search, compare, and book services effortlessly while ensuring transparency through reviews and ratings.
                        </p>
                    </div>
                    <div className="relative w-full md:w-1/3 h-[170px] flex justify-center items-center md:flex">
                        <img src={resources.Service1.src} alt="Electric Car" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
                {/* card 2 */}
                <div className="flex flex-col md:flex-row items-center gap-8 mx-auto bg-white p-7 md:p-10 shadow-lg h-full rounded my-5 border-b hover:border-indigo-500">
                    <div className="w-full md:w-2/3 space-y-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                            Send Service Request
                        </h1>
                        <p className="text-gray-600">
                            Took conversation is a convenient platform that allows users to schedule conversations with service providers effortlessly. It streamlines the booking process by providing real-time availability, reminders, and easy rescheduling options..
                        </p>
                    </div>
                    <div className="relative w-full md:w-1/3 h-[170px] flex justify-center items-center md:flex">
                        <img src={resources.Service2.src} alt="Electric Car" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
                {/* card 3 */}
                <div className="flex flex-col md:flex-row items-center gap-8 mx-auto bg-white p-7 md:p-10 shadow-lg h-full rounded my-5 border-b hover:border-indigo-500">
                    <div className="w-full md:w-2/3 space-y-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                            Get Service
                        </h1>
                        <p className="text-gray-600">
                            Get Service is a reliable platform that helps users find and access professional services quickly. It connects customers with verified service providers, ensuring quality and convenience. With easy booking, real-time availability, and customer reviews, it simplifies the process of getting the right service when needed.
                        </p>
                    </div>
                    <div className="relative w-full md:w-1/3 h-[170px] flex justify-center items-center md:flex">
                        <img src={resources.Service3.src} alt="Electric Car" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
            </section>
  )
}

export default Process