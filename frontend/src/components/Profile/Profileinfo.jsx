import React from 'react'

function Profileinfo() {
  return (
    <div>
      <div classname="md:grid md:grid-cols-3 md:gap-6">
  <div classname="md:col-span-1 flex justify-between">
    <div classname="px-4 sm:px-0">
      <h3 classname="text-xl font-medium text-gray-900">
        {'{'}" "{'}'}
        Profile Information{'{'}" "{'}'}
      </h3>
      <p classname="mt-1 text-gray-600">
        {'{'}" "{'}'}
        Update your account's profile information and email address.{'{'}" "{'}'}
      </p>
    </div>
    <div classname="px-4 sm:px-0">
    </div>
    <div className="mt-5 md:col-span-2 md:mt-0">
      <form>
        <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-4">
              <input id="photo" type="file" className="hidden" />
              <div classname="mt-2">
                <img src="https://ui-avatars.com/api/?bold=true&name=n+p&color=4c51bf&background=82efe3" alt="nirmal prajapati" classname="h-20 w-20 rounded-full object-cover" />
              </div>
              <button type="button" classname="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition mr-2 mt-2">
                Select A New Photo{'{'}" "{'}'}
              </button>
            </div>
            <div classname="col-span-6 sm:col-span-4">
              <label classname="block font-semibold text-sm text-gray-700" htmlfor="name">
                <span>Name</span>
              </label>
              <input className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full" id="name" type="text" autoComplete="name" />
              <div className="mt-2" style={{ display: "none" }}>
                <p className="text-sm text-red-600">
                </p>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label classname="block font-semibold text-sm text-gray-700" htmlfor="name">
                <span>Email</span>
              </label>
              <input className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full" id="email" type="email" autoComplete="email" />
              <div className="mt-2" style={{ display: "none" }}>
                <p className="text-sm text-red-600">
                </p>
              </div>
            </div>
            <div className="col-span-6 sm:col-span-4">
              <label classname="block font-semibold text-sm text-gray-700" htmlfor="name">
                <span>Mobile</span>
              </label>
              <input classname="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full" id="name" type="number" autoComplete="name" />
              <div classname="mt-2" style={{ display: "none"} }>
                <p classname="text-sm text-red-600">
                </p></div>
            </div>
          </div>
        </div>
        <div classname="flex items-center justify-end bg-gray-50 px-4 py-3 text-end shadow sm:rounded-bl-md sm:rounded-br-md sm:px-6">
          <button type="submit" classname="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium tracking-wide text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50">
            Edit Details
          </button>
        </div>
      </form>
    </div>
  </div>
    </div>
  </div>
  )
}

export default Profileinfo
