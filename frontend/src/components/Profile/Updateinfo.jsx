import React from 'react'

function Updateinfo() {
  return (
    <div>
      <div>
          <div className="md:grid md:grid-cols-3 md:gap-6 mt-10 sm:mt-0">
            <div className="md:col-span-1 flex justify-between">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-medium text-gray-900">
                  {" "}
                  Update Password{" "}
                </h3>
                <p className="mt-1 text-gray-600">
                  {" "}
                  Ensure your account is using a long, random password to stay
                  secure.{" "}
                </p>
              </div>
              <div className="px-4 sm:px-0" />
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        className="block font-semibold text-sm text-gray-700"
                        htmlFor="current_password"
                      >
                        <span>Current Password</span>
                      </label>
                      <input
                        className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full"
                        id="current_password"
                        type="password"
                        autoComplete="current-password"
                        defaultValue=""
                      />
                      <div className="mt-2" style={{ display: "none" }}>
                        <p className="text-sm text-red-600" />
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        className="block font-semibold text-sm text-gray-700"
                        htmlFor="password"
                      >
                        <span>New Password</span>
                      </label>
                      <input
                        className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full"
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        defaultValue=""
                      />
                      <div className="mt-2" style={{ display: "none" }}>
                        <p className="text-sm text-red-600" />
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        className="block font-semibold text-sm text-gray-700"
                        htmlFor="password_confirmation"
                      >
                        <span>Confirm Password</span>
                      </label>
                      <input
                        className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full"
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        defaultValue=""
                      />
                      <div className="mt-2" style={{ display: "none" }}>
                        <p className="text-sm text-red-600" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end bg-gray-50 px-4 py-3 text-end shadow sm:rounded-bl-md sm:rounded-br-md sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium tracking-wide text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50"
                  >
                    Save{" "}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Updateinfo
