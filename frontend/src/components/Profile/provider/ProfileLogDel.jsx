import React from 'react';
import CustomAlert from "../../CustomAlert";
import { useState } from 'react';
import authApi from '../../../config/auth-config';

function Logoutdelete() {
  const [alert, setAlert] = useState({
    status: false,
  })

  const cancel = () => {
    setAlert(prev => ({ ...prev, status: false }))
  }

  const handleLogout = () => {
  localStorage.removeItem('token');
  setAlert(prev => ({ ...prev, status: false }));
    window.location.href = '/';
};

  const setLogout = () => {
    setAlert({
      title: "Are you sure !",
      description: "would you like to logout the current account?",
      status: true,
      buttonText: "Yes, Logout",
      onClose: handleLogout,
      cancel: cancel
    })
  }

  const handleDelete = async () => {
    try {
    await authApi.delete('/provider/info');
    localStorage.removeItem('token');
    window.location.href = "/provider/login";
    } catch (error) {
      console.error("Error deleting account:", error);
      setAlert({
        title: "Error Deleting Account",
        description: "Failed to delete account. Please try again later.",
        status: true,
        buttonText: "Ok",
        onClose: cancel,
        cancel: cancel
      });
    }
  }

    const setDelete = () => {
    setAlert({
      title: "Are you sure !",
      description: "would you like to delete the account?",
      status: true,
      buttonText: "Yes, Delete",
      onClose: handleDelete,
      cancel: cancel
    })
  }

  return (
    <div>
      <CustomAlert
        title={alert.title}
        description={alert.description}
        status={alert.status}
        buttonText={alert.buttonText}
        onClose={alert.onClose}
        cancel={alert.cancel}
      />

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
                type="button" onClick={setLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-red-600 rounded-md font-semibold text-xs text-red-600 uppercase tracking-widest disabled:opacity-25 transition"
              >
                Logout
              </button>
              <button
                type="button" onClick={setDelete}
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
    </div>
  )
}

export default Logoutdelete
