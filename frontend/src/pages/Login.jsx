import React from 'react'
import { Plug, LibraryBig, Car, Wrench, PartyPopper } from 'lucide-react'

function Login() {
    return (

        <div className="bg-gray-100 w-100 h-100 overflow-hidden">
            <div className="text-gray-500 overflow-hidden">
                <i data-lucide="plug" className="absolute top-24 left-60 rotate-[330deg] z-0" />
                <i data-lucide="library-big" className="absolute top-[500px] right-20 z-0" />
                <i data-lucide="car" className="absolute top-[400px] left-[30vw] rotate-[330deg] z-0" />
                <i data-lucide="wrench" className="absolute top-[500px] left-40 rotate-[10deg] z-0" />
                <i data-lucide="party-popper" className="absolute top-[250px] left-[50%] z-0" />
            </div>
            <main className="flex items-center justify-center border-dashed border-primary m-5 mt-20 p-2 border-2 md:m-10 md:p-5 w-screen lg:m-14 lg:p-20 rounded-lg bg-white">
                <div className="mx-2 mt-10 w-[550px] hidden md:block">
                    <h1 className="text-5xl font-bold tracking-wide">Get Any Service at Your<span className="bg-primary text-gray-100"> Doorsteps</span></h1>
                    <p className="text-gray-500 mt-4">Welcome to EZService, your trusted doorstep service provider. We bring convenience to your home with fast, reliable, and professional solutions. Book now and enjoy hassle-free services at your doorstep!</p>
                </div>
                <div className="max-w-md w-full space-y-8 p-10 bg-gray-200 rounded-xl shadow border">
                    <div className="text-center">
                        <h2 className="mt-2 text-3xl font-extrabold">
                            Login to your account
                        </h2>
                    </div>
                    <form id="formsubmit" className="mt-8 space-y-6 text-sm" action="submit" method="POST">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <p id="errormsg" className="text-red-600 -mt-3">Error message print here</p>
                            <div className="pt-2">
                                <label htmlFor="user_id" className="sr-only">Email Address</label>
                                <input id="email" name="email" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-gray-400 bg-gray-50 tracking-wide placeholder-gray-700 rounded focus:outline-none focus:border-primary focus:z-10 sm:text-sm lowercase" placeholder="email" defaultValue />
                            </div><br />
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input id="password" name="password" type="password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-400 bg-gray-50 placeholder-gray-700 tracking-wide rounded focus:outline-none focus:border-primary focus:z-10 sm:text-sm" placeholder="Password" defaultValue />
                            </div>
                        </div>
                        <a className="text-sm text-red-500">Forgot Password?</a>
                        <div>
                            <button id="formbtn" type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary focus:outline-none mb-5">LogIn Now</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>

    )
}

export default Login
