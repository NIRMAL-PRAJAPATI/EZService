import { LogOut, Trash2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8 font-sans">
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 flex justify-between">
          <div className="px-4 sm:px-0">
            <h3 className="text-xl font-medium text-gray-900">
              {" "}
              Profile Information{" "}
            </h3>
            <p className="mt-1 text-gray-600">
              {" "}
              Update your account's profile information and email address.{" "}
            </p>
          </div>
          <div className="px-4 sm:px-0" />
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form>
            <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <input id="photo" type="file" className="hidden" />
                  <div className="mt-2">
                    <img
                      src="https://ui-avatars.com/api/?bold=true&name=n+p&color=4c51bf&background=82efe3"
                      alt="nirmal prajapati"
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition mr-2 mt-2"
                  >
                    Select A New Photo{" "}
                  </button>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label
                    className="block font-semibold text-sm text-gray-700"
                    htmlFor="name"
                  >
                    <span>Name</span>
                  </label>
                  <input
                    className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full"
                    id="name"
                    type="text"
                    autoComplete="name"
                  />
                  <div className="mt-2" style={{ display: "none" }}>
                    <p className="text-sm text-red-600" />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label
                    className="block font-semibold text-sm text-gray-700"
                    htmlFor="name"
                  >
                    <span>Email</span>
                  </label>
                  <input
                    className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full"
                    id="name"
                    type="text"
                    autoComplete="name"
                  />
                  <div className="mt-2" style={{ display: "none" }}>
                    <p className="text-sm text-red-600" />
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <label
                    className="block font-semibold text-sm text-gray-700"
                    htmlFor="name"
                  >
                    <span>Mobile</span>
                  </label>
                  <input
                    className="max-w-full outline-none border-b border-gray-400 text-gray-700 block pl-1 w-full"
                    id="name"
                    type="number"
                    autoComplete="name"
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
                Edit Details
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="py-8">
          <div className="border-t border-gray-200" />
        </div>
      </div>
    </div>
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
    <div className="hidden sm:block">
      <div className="py-8">
        <div className="border-t border-gray-200" />
      </div>
    </div>
    <div className="md:grid md:grid-cols-3 md:gap-6 mt-10 sm:mt-0">
      <div className="md:col-span-1 flex justify-between">
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-medium text-gray-900">
            Logout &amp; Delete Account{" "}
          </h3>
          <p className="mt-1 text-gray-600">
            {" "}
            Logout or Permanently delete your account.{" "}
          </p>
        </div>
        <div className="px-4 sm:px-0" />
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
          <div className="max-w-xl text-sm text-gray-600">
            {" "}
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Before deleting your account, please download
            any data or information that you wish to retain.{" "}
          </div>
          <div className="mt-5 space-x-2">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-red-600 rounded-md font-semibold text-xs text-red-600 uppercase tracking-widest disabled:opacity-25 transition"
            >
              Logout
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-red-500 active:bg-red-600 disabled:opacity-25 transition"
            >
              Delete Account{" "}
            </button>
          </div>
          <dialog className="z-50 m-0 min-h-full min-w-full overflow-y-auto bg-transparent backdrop:bg-transparent">
            <div
              className="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0"
              scroll-region=""
            >
              <div
                className="fixed inset-0 transform transition-all"
                style={{ display: "none" }}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900" />
              </div>
              <div
                className="mb-6 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800 sm:max-w-2xl"
                style={{ display: "none" }}
              >
                {/**/}
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  </main>
  );
}
