import React from 'react'
import { Plug, LibraryBig, Car, Wrench, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/axios-config'

function Login() {
    const [formData, setFormData] = useState({ emailmobile: "", password: "" })
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const submitData = (e) => {
    e.preventDefault();

        api.post('/customer/login', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            console.log("success login", response.data);
            localStorage.setItem('token', response.data.token)
            const location = response.data.data.city + ", " + response.data.data.state + ", " + response.data.data.country + ", " + response.data.data.pincode;
            localStorage.setItem('location', location)
            navigate('/')
        }).catch((error) => {
            console.error(error);
            setErrorMessage(error.response.data.message);

        });
    }

    return (
        <div className="md:bg-gray-50 h-[100vh] flex justify-center">
            <div className="text-gray-500 overflow-hidden z-0  hidden md:block">
                <Plug className="absolute top-24 left-60 rotate-[330deg] z-0" />
                <Car className="absolute top-[400px] left-[30vw] rotate-[330deg] z-0" />
                <LibraryBig className="absolute top-[500px] right-20 z-0" />
                <Wrench className="absolute top-[500px] left-40 rotate-[10deg] z-0" />
                <PartyPopper className="absolute top-[250px] left-[50%] z-0" />
            </div>
            <div className="flex items-center justify-center w-7xl">
                <main className="flex items-center justify-center md:justify-between border-dashed w-full border-indigo-500 md:border-2 md:m-10 md:p-10 lg:m-10 lg:p-20 rounded-lg bg-white">
                    <div className="mx-2 mt-10 w-[550px] hidden md:block">
                        <h1 className="text-5xl font-bold tracking-wide">Get Any Service at Your<span className="bg-indigo-500 text-white"> Doorsteps</span></h1>
                        <p className="text-gray-500 mt-4 mr-10">Welcome to EZService, your trusted doorstep service provider. We bring convenience to your home with fast, reliable, and professional solutions. Book now and enjoy hassle-free services at your doorstep!</p>
                    </div>
                    <div className="max-w-md w-full">
                        <div className="text-center">
                            <h2 className="mt-2 text-3xl font-extrabold">
                                Login your account
                            </h2>
                        </div>
                        <form onSubmit={submitData} id="formsubmit" className="mt-3 space-y-2 text-sm p-5" action="submit" method="POST">
                            <div className="rounded-md">
                                <p id="errormsg" className="text-red-600 -mt-3" name="errorMessage">{errorMessage}</p>
                                <div className="mt-4 relative">
                                    <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Email/Mobile No.</label>
                                    <input
                                        type="text"
                                        name="emailmobile"
                                        className="block w-full pl-4 pr-3 py-4 md:py-3 border border-gray-300 bg-white rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg md:text-sm"
                                        value={formData.emailmobile}
                                        onChange={handleChange}
                                        required />
                                </div><br />
                                <div className="relative">
                                    <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="block w-full pl-4 pr-3 py-4 md:py-3 border border-gray-300 bg-white rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg md:text-sm"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <a className="text-sm text-red-500">Forgot Password?</a>
                            <div>
                                <button id="formbtn" type="submit" className="group relative w-full flex justify-center py-4 md:py-3 px-4 border border-transparent font-medium rounded-sm text-white bg-indigo-500 hover:bg-indigo-600 text-lg md:text-sm cursor-pointer focus:outline-none mt-1">LogIn Now</button>
                            </div>
                        </form>
                        <div className='w-full flex'>
                        <a href='/register' className='-mt-3 mx-auto text-gray-600 tracking-wide font-semibold cursor-pointer'>Create a new account?</a>
                        </div>
                    </div>
                </main>
            </div>
        </div>

    )
}

export default Login
