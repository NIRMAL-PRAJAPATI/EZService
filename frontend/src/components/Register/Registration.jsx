import { useState } from "react"

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log(formData)
  }

  return (
    <>
        <h1 className="text-3xl font-extrabold text-center mb-8">Create an account</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Full name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Mobile No.</label>
            <input
              type="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Confirm Password</label>
            <input
              type="password"
              name="confirmpassword"
              // value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <p id="errormsg" className="text-red-600 -mt-2 mb-1 text-sm">Error message print here</p>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Register</button>
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
