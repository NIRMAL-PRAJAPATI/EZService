import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Registration () {
  const { register, handleSubmit, reset, watch,setValue, formState: {errors} } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        reset({
        city: data.city,
        state: data.region,
        country: data.country_name,
      });
      })
      .catch((err) => console.error("IP fetch error:", err));
  }, [setValue]);
    
  const [errorMessage, setErrorMessage] = useState("");
  const api = 'http://localhost:3000';

  const onVarifyData = async (data) => {
    const { confirmpassword, ...formData } = data;
    console.log(formData);

      await axios.post(`${api}/customer/varifyemailmobile`, formData).then(response => {
        navigate('/register/mobilevarification', {state: {'formData': formData}});
      }).catch((error) => {
      if(error.response) {
        reset(error.response.data.data);
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("");
      }
    })
  }

  return (
    <>
        <h1 className="text-3xl font-extrabold text-center mb-8">Create an account</h1>

        <form onSubmit={handleSubmit(onVarifyData)}>
          <p className="text-red-600 mb-3">{errorMessage}</p>
          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Your Name</label>
            <input
              type="text"
              name="name"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("name", {required: "name is required",
                minLength: {value: 3, message: "name must be at least 3 characters"}
              })}
            />
               {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Mobile No.</label>
            <input
              type="mobile"
              name="mobile"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("mobile", {required: "mobile is required",
                pattern: {value: /^[0-9]{10}$/, message: "Mobile number must be 10 digits"}
              })}
            />
            {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile.message}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Email Address</label>
            <input
              type="email"
              name="email"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("email", {required: "email is required",
                pattern: {value: /^\S+@\S+\.\S+$/, message: "Invalid email format"}
              })}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>

          <div className='flex gap-2'>
          <div className="mb-4 relative w-full">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">PIN Code</label>
            <input
              type="number"
              name="pincode"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("pincode")}
            />
            {errors.pincode && <p className="text-red-600 text-sm">{errors.pincode.message}</p>}
          </div>
          <div className="mb-4 relative w-full">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">City / Town</label>
            <input
              type="text"
              name="city"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("city", {required: "city is required"})}
            />
            {errors.city && <p className="text-red-600 text-sm">{errors.city.message}</p>}
          </div>
          </div>

          <div className='flex gap-2'>
          <div className="mb-4 relative w-full">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">State</label>
            <input
              type="text"
              name="state"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("state", {required: "State is required"})}
            />
            {errors.state && <p className="text-red-600 text-sm">{errors.state.message}</p>}
          </div>
          <div className="mb-4 relative w-full">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Country</label>
            <input
              type="text"
              name="country"
              className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              {...register("country", {required: "country is required"})}
            />
            {errors.country && <p className="text-red-600 text-sm">{errors.country.message}</p>}
          </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white text-lg md:text-sm py-3 px-4 rounded-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Register</button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-500 hover:text-indigo-600">
              Log in
            </a>
          </p>
        </div>
        </>
  )
}

export default Registration
