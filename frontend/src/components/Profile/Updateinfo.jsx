import React, { useState } from 'react';
import authApi from '../../config/auth-config';
import CustomAlert from "../CustomAlert";

function Updateinfo() {
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [alert, setAlert] = useState({
    status: false,
  })

   const handleClose = () => {
    setAlert(prev => ({ ...prev, status: false }));
  };

  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword !== confirmPassword) {
      setErrorMessage('Confirm password does not match new password.');
      return;
    }

    try {
      await authApi.put('/customer/password', password);
      setAlert({
        title: "Password Updated !",
        description: "Your profile password changed successfully.",
        status: true,
        buttonText: "Ok",
        onClose: handleClose
      })
      setErrorMessage('');
      setPassword({ currentPassword: '', newPassword: '' });
      setConfirmPassword('');
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
    {/* custome alert */}
    <CustomAlert
        title={alert.title}
        description={alert.description}
        status={alert.status}
        ButtonText={alert.buttonText}
        onClose={alert.onClose}
      />

    <div className="mt-10">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1 px-4 sm:px-0">
          <h3 className="text-xl font-medium text-gray-900">Update Password</h3>
          <p className="mt-1 text-gray-600">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-tl-md sm:rounded-tr-md">
              {errorMessage && (
                <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
              )}
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <label className="block font-semibold text-sm text-gray-700" htmlFor="current_password">
                    Current Password
                  </label>
                  <input
                    id="current_password"
                    type="password"
                    name="currentPassword"
                    value={password.currentPassword}
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="max-w-full outline-none border-b border-gray-300 focus:border-gray-400 text-gray-700 block pl-1 w-full"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label className="block font-semibold text-sm text-gray-700" htmlFor="password">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="newPassword"
                    value={password.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="max-w-full outline-none border-b border-gray-300 focus:border-gray-400 text-gray-700 block pl-1 w-full"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label className="block font-semibold text-sm text-gray-700" htmlFor="password_confirmation">
                    Confirm Password
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="max-w-full outline-none border-b border-gray-300 focus:border-gray-400 text-gray-700 block pl-1 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end bg-gray-50 px-4 py-3 text-end shadow sm:rounded-bl-md sm:rounded-br-md sm:px-6">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium tracking-wide text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50"
                disabled={
                  !password.currentPassword || !password.newPassword || !confirmPassword
                }
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Updateinfo;
