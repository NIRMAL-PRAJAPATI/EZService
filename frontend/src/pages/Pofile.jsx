import { LogOut, Trash2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container max-w-7xl mx-auto min-h-screen bg-gray-50 px-4 py-8">
      
      {/* PROFILE INFO SECTION */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start">
        {/* Text Section */}
        <div className="w-full md:w-1/3">
          <h2 className="mb-1 text-xl font-semibold text-gray-800">
            Profile Information
          </h2>
          <p className="text-m text-gray-600">
            Update your account's profile information and email address.
          </p>
        </div>

        {/* Form Section */}
        <div className="w-full  md:w-2/3 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start">
            <div className="mb-4 h-20 w-20 rounded-full bg-teal-300 flex items-center justify-center text-xl font-bold text-violet-700">
              NP
            </div>
            <button className=" mb-6 rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">
              SELECT A NEW PHOTO
            </button>
            <div className="w-full space-y-4">
              <b>Name</b>
              <input
                type="text"
                className="w-full border-t-0 border-l-0 border-r-0 border text-decoration-none focus:outline-none focus:ring-0"
              />
              <b>Email</b>
              <input
                type="email"
                className="w-full border-t-0 border-l-0 border-r-0 border text-decoration-none focus:outline-none focus:ring-0"
              />
              <b>Mobile</b>
              <input
                type="tel"
                className="w-full border-t-0 border-l-0 border-r-0 border text-decoration-none focus:outline-none focus:ring-0"
              />
              <div className="flex justify-end">
                <button className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE PASSWORD SECTION */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start">
        <div className="w-full md:w-1/3">
          <h2 className="mb-1 text-xl font-semibold text-gray-800">
            Update Password
          </h2>
          <p className="text-m text-gray-600">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <div className="w-full md:w-2/3 rounded-lg bg-white p-6 shadow-sm space-y-4">
          <b>Current Password</b>
          <input
            type="password"
            className="w-full border-t-0 border-l-0 border-r-0 border text-decoration-none focus:outline-none focus:ring-0"
          />
          <b>New Password</b>
          <input
            type="password"
            className="w-full border-t-0 border-l-0 border-r-0 border text-decoration-none focus:outline-none focus:ring-0"
          />
          <b>Confirm Password</b>
          <input
            type="password"
            className="w-full border-t-0 border-l-0 border-r-0 border text-decoration-none focus:outline-none focus:ring-0"
          />
          <div className="flex justify-end">
            <button className="rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* LOGOUT & DELETE SECTION */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start">
        <div className="w-full md:w-1/3">
          <h2 className="mb-1 text-xl font-semibold text-gray-800">
            Logout & Delete Account
          </h2>
          <p className="text-m text-gray-600">
            Logout or delete your account permanently.
          </p>
        </div>

        <div className="w-full md:w-2/3 rounded-lg bg-white p-6 shadow-sm flex flex-col gap-4">
          <h6>
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.
          </h6>
          <div className="flex gap-4">
            <button className="flex items-center justify-center gap-2 rounded-md bg-red-100 px-4 py-2 text-sm text-red-600 hover:bg-red-200">
              <LogOut size={16} />
              Logout
            </button>
            <button className="flex items-center justify-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
