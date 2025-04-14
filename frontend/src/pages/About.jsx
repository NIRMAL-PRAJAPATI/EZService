import React from 'react';
import { Boxes, BriefcaseBusiness, Github, Instagram, Linkedin, PencilRuler, Send, ShieldCheck, User , Map} from 'lucide-react';

function About() {
    return (
        
          <>  
            {/* Tailwind CSS CDN */}
            {/* Custom Tailwind Configuration */}
            {/* Icons */}
            <section className="bg-gray-50">
                {/* Hero section */}
                <div className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-gray-50 transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                                <polygon points="50,0 100,0 50,100 0,100" />
                            </svg>
                            <div className="pt-10 sm:pt-16 lg:pt-16 lg:pb-14 lg:overflow-hidden">
                                <div className="px-4 sm:px-6 lg:px-8">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                        <span className="block">About</span>
                                        <span className="block text-indigo-500-600">Our <span className="text-indigo-500 tracking-wide">EZService</span></span>
                                    </h1>
                                    <p className="mt-3 text-md text-gray-500 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 md:text-md lg:mx-0">
                                        Founded in 2010, our company has been at the forefront of innovation, delivering
                                        exceptional products and services to our clients worldwide. We're committed to
                                        excellence, integrity, and customer satisfaction.
                                    </p>
                                    <button className="px-4 py-2 bg-indigo-500 border-none text-white ml-2 mt-3 rounded">Go to Home</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://miro.medium.com/v2/resize:fit:1400/1*G788U7EQNm70xhiW_hbwew.jpeg" alt="Team working together" />
                    </div>
                </div>
            </section>
            <section>
                {/* Values Section */}
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
            {/* How It Works */}
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
                        <img src="/frontend/public/img/service img1.svg" alt="Electric Car" className="max-w-full max-h-full object-contain" />
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
                        <img src="/frontend/public/img/service img2.svg" alt="Electric Car" className="max-w-full max-h-full object-contain" />
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
                        <img src="/frontend/public/img/service img3.svg" alt="Electric Car" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>
            </section>
            <section className="bg-gray-50 pt-10 pb-1">
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
                        <p className="text-gray-500 text-sm">From DreamIT Solutions</p>
                    </div>
                    {/* Ratings */}
                    <div className="text-center">
                        <p className="text-indigo-500 text-md">Ratings</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-1">4.5/5</h2>
                        <p className="text-gray-500 text-sm">In Industry</p>
                    </div>
                </div>
            </section>
            <section>
                {/* Map Section */}
                <section className="py-8">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <p className="mt-1 text-3xl leading-8 font-extrabold tracking-tight text-gray-800 sm:text-4xl text-center mb-5">Find Us</p>
                        <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                            {/* Replace with actual map embed code */}
                            <div className="text-center">
                                <Map className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                                <p className="text-gray-600">Interactive map would be embedded here</p>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </>

    )
}

export default About
