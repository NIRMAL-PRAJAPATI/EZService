import { Boxes, PencilRuler, ShieldCheck, User } from 'lucide-react'
import React from 'react'

function Principle() {
  return (
    <section>
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-indigo-500 font-semibold tracking-wide uppercase">Our Values</h2>
                            <p className="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-gray-800 sm:text-4xl">
                                Principles That Guide Us
                            </p>
                            <p className="max-w-2xl text-md text-gray-500 lg:mx-auto">
                                Our core values shape our culture and drive our decisions every day.
                            </p>
                        </div>
                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-white">
                                        <ShieldCheck className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Integrity</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            We conduct business with honesty, transparency, and ethical standards that exceed
                                            industry norms.
                                            transparency, and ethical standards that exceed industry norms.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-white">
                                        <PencilRuler className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Innovation</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            We embrace creativity and forward-thinking to develop solutions that address
                                            tomorrow's challenges.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-white">
                                        <User className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Collaboration</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            We believe in the power of teamwork, fostering an environment where diverse
                                            perspectives drive better outcomes.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 text-white">
                                        <Boxes className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div className="ml-16">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Excellence</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            We strive for the highest standards in everything we do, continuously improving our
                                            processes and services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
  )
}

export default Principle