import { LogOut, Trash2 } from "lucide-react";
import Profileinfo from "../components/Profile/provider/ProfileInfo";
import ProfileBank from "../components/Profile/provider/ProfileBank";
import LogoutDelete from "../components/Profile/provider/ProfileLogDel";
import ProfilePassword from '../components/Profile/provider/ProfilePassword';

export default function ProfilePage() {
  return (
    <div className="bg-gray-100">
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8 font-sans">
        <div>
          <Profileinfo />
          <div className="hidden sm:block">
            <div className="py-8">
              <div className="border-t border-gray-200" />
            </div>
          </div>
        </div>
        <ProfileBank />
          <div className="hidden sm:block">
            <div className="py-8">
              <div className="border-t border-gray-200" />
            </div>
          </div>
        <ProfilePassword />
        <div className="hidden sm:block">
          <div className="py-8">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        <LogoutDelete />
      </main>
    </div>
  );
}




// import React, { useEffect, useState } from 'react';
// import {
//   Camera, LogOut, Trash2, Lock, CreditCard, User, Mail,
//   Phone, MapPin, Building, Globe, DollarSign
// } from 'lucide-react';
// import authApi from '../config/auth-config';
// import DashboardHeader from '../components/provider/Header';

// const ProfilePage = () => {
//   const [photo, setPhoto] = useState("https://ui-avatars.com/api/?bold=true&name=n+p&color=4c51bf&background=82efe3");

//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     mobile: '',
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//   });

//   const [bankData, setBankData] = useState({
//     holder_name: '',
//     account_number: '',
//     account_type: '',
//     ifsc_code: '',
//     bank_name: '',
//     branch: '',
//   });

//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const handleProfileChange = (e) => {
//     const { id, value } = e.target;
//     setProfileData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleBankChange = (e) => {
//     const { id, value } = e.target;
//     setBankData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { id, value } = e.target;
//     setPasswordData((prev) => ({ ...prev, [id]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         if (e.target && e.target.result) {
//           setPhoto(e.target.result.toString());
//         }
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   useEffect(() => {
//     authApi.get('/provider/profile').then((response) => {
//       const { data } = response;
//       setProfileData({
//         name: data.name,
//         email: data.email,
//         mobile: data.mobile,
//         address: data.address,
//         city: data.city,
//         state: data.state,
//         country: data.country
//       });

//       if (data.providerBank) {
//         setBankData({
//           holder_name: data.providerBank.holder_name,
//           account_number: data.providerBank.account_number,
//           account_type: data.providerBank.account_type,
//           ifsc_code: data.providerBank.ifsc_code,
//           bank_name: data.providerBank.bank_name,
//           branch: data.providerBank.branch
//         });
//       }
//     }).catch((error) => {
//       console.error(error);
//     });
//   }, []);

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await authApi.put('/provider/profile', profileData);
//       alert('Profile updated successfully.');
//     } catch (error) {
//       console.error('Profile update error:', error);
//       alert('Error updating profile.');
//     }
//   };

//   const handleBankSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await authApi.put('/provider/bank', bankData);
//       alert('Bank information updated.');
//     } catch (error) {
//       console.error('Bank update error:', error);
//       alert('Error updating bank details.');
//     }
//   };

//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       alert('New passwords do not match.');
//       return;
//     }
//     try {
//       await authApi.put('/provider/password', passwordData);
//       alert('Password updated.');
//     } catch (error) {
//       console.error('Password update error:', error);
//       alert('Error updating password.');
//     }
//   };

//   const handleLogout = () => {
//       alert('Logged out successfully.');
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.reload();
//   };

//   const handleDeleteAccount = () => {
//     if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
//       authApi.delete('/provider/delete').then(() => {
//         alert('Account deleted successfully.');
//         // Redirect to home page or login
//       }).catch((error) => {
//         console.error('Account deletion error:', error);
//         alert('Error deleting account.');
//       });
//     }
//   };

//   return (
//     <div className="bg-gray-100 font-sans">
//       <DashboardHeader />
//       <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
//         {/* Profile Section */}
//         <Section
//           title="Business Information"
//           description="Update your account's business information and email address."
//           onSubmit={handleProfileSubmit}
//           buttonLabel="Update Profile"
//         >
//           <FormGrid>
//             <PhotoInput photo={photo} handlePhotoChange={handlePhotoChange} />
//             {[{ id: 'name', label: 'Name', Icon: User },
//               { id: 'email', label: 'Email', Icon: Mail, type: 'email' },
//               { id: 'mobile', label: 'Mobile', Icon: Phone },
//               { id: 'address', label: 'Address', Icon: MapPin, type: 'textarea' }].map(({ id, label, Icon, type = 'text' }) => (
//               <InputField
//                 key={id}
//                 id={id}
//                 label={label}
//                 Icon={Icon}
//                 value={profileData[id]}
//                 onChange={handleProfileChange}
//                 type={type}
//               />
//             ))}
//             {['city', 'state', 'country'].map((id) => (
//               <InputField
//                 key={id}
//                 id={id}
//                 label={id.charAt(0).toUpperCase() + id.slice(1)}
//                 Icon={Building}
//                 value={profileData[id]}
//                 onChange={handleProfileChange}
//               />
//             ))}
//           </FormGrid>
//         </Section>

//         {/* Banking Section */}
//         <Section
//           title="Banking Information"
//           description="Update your account's business banking details."
//           onSubmit={handleBankSubmit}
//           buttonLabel="Update Bank Info"
//         >
//           <FormGrid>
//             {[{ id: 'bank_name', label: 'Bank Name', Icon: Building },
//               { id: 'holder_name', label: 'Account Holder Name', Icon: User },
//               { id: 'account_number', label: 'Account Number', Icon: CreditCard },
//               { id: 'account_type', label: 'Account Type', Icon: DollarSign },
//               { id: 'ifsc_code', label: 'IFSC Code', Icon: CreditCard },
//               { id: 'branch', label: 'Branch', Icon: Building }].map(({ id, label, Icon }) => (
//               <InputField
//                 key={id}
//                 id={id}
//                 label={label}
//                 Icon={Icon}
//                 value={bankData[id]}
//                 onChange={handleBankChange}
//               />
//             ))}
//           </FormGrid>
//         </Section>

//         {/* Password Section */}
//         <Section
//           title="Update Password"
//           description="Ensure your account is using a secure password."
//           onSubmit={handlePasswordSubmit}
//           buttonLabel="Change Password"
//         >
//           <FormGrid>
//             {[{ id: 'currentPassword', label: 'Current Password' },
//               { id: 'newPassword', label: 'New Password' },
//               { id: 'confirmPassword', label: 'Confirm Password' }].map(({ id, label }) => (
//               <InputField
//                 key={id}
//                 id={id}
//                 label={label}
//                 Icon={Lock}
//                 type="password"
//                 value={passwordData[id]}
//                 onChange={handlePasswordChange}
//               />
//             ))}
//           </FormGrid>
//         </Section>

//         {/* Account Deletion */}
//         <Section title="Logout & Delete Account" description="Logout or delete your account permanently.">
//           <div className="px-4 py-5 sm:p-6 bg-white shadow sm:rounded-lg">
//             <p className="max-w-xl text-sm text-gray-600 mb-4">
//               Once your account is deleted, all of its resources and data will be permanently deleted.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md text-xs font-semibold uppercase cursor-pointer"
//               >
//                 <LogOut className="w-4 h-4 mr-2" /> Logout
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteAccount}
//                 className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold uppercase"
//               >
//                 <Trash2 className="w-4 h-4 mr-2" /> Delete Account
//               </button>
//             </div>
//           </div>
//         </Section>
//       </main>
//     </div>
//   );
// };

// // Reusable Components

// const Section = ({ title, description, children, onSubmit, buttonLabel }) => (
//   <div className="mt-10 md:grid md:grid-cols-3 md:gap-6">
//     <div className="md:col-span-1">
//       <div className="px-4 sm:px-0">
//         <h3 className="text-xl font-medium text-gray-900">{title}</h3>
//         <p className="mt-1 text-gray-600">{description}</p>
//       </div>
//     </div>
//     <div className="mt-5 md:col-span-2 md:mt-0">
//       <form onSubmit={onSubmit}>
//         <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-t-md">
//           {children}
//         </div>
//         <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 sm:rounded-b-md">
//           <button
//             type="submit"
//             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
//           >
//             {buttonLabel}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// );

// const FormGrid = ({ children }) => (
//   <div className="grid grid-cols-6 gap-6">{children}</div>
// );

// const InputField = ({ id, label, Icon, value, onChange, type = 'text' }) => (
//   <div className="col-span-6 sm:col-span-4">
//     <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
//       <span className="flex items-center"><Icon className="w-4 h-4 mr-2" />{label}</span>
//     </label>
//     {type === 'textarea' ? (
//       <textarea
//         id={id}
//         rows="3"
//         className="w-full border-b outline-none focus:border-indigo-500 text-gray-700 pl-1"
//         value={value}
//         onChange={onChange}
//       />
//     ) : (
//       <input
//         id={id}
//         type={type}
//         className="w-full border-b outline-none focus:border-indigo-500 text-gray-700 pl-1"
//         value={value}
//         onChange={onChange}
//       />
//     )}
//   </div>
// );

// const PhotoInput = ({ photo, handlePhotoChange }) => (
//   <div className="col-span-6 sm:col-span-4">
//     <input id="photo" type="file" className="hidden" onChange={handlePhotoChange} />
//     <div className="mt-2">
//       <img src={photo} alt="profile" className="h-20 w-20 rounded-full object-cover" />
//     </div>
//     <label
//       htmlFor="photo"
//       className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-xs font-semibold text-gray-700 cursor-pointer mt-2"
//     >
//       <Camera className="w-4 h-4 mr-2" /> Select A New Photo
//     </label>
//   </div>
// );

// export default ProfilePage;
