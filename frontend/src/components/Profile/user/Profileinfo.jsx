import { useEffect, useState } from "react";
import authApi from '../../../config/auth-config';
import CustomAlert from "../../CustomAlert";
import Loading from "../../Loading";

function ProfileInfo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    country: ""
  });

  const [alert, setAlert] = useState({
      status: false,
    })

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authApi.get("/customer/profile");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClose = () => {
    setAlert(prev => ({ ...prev, status: false }));
  };

  const handleEditOrSave = async () => {
    if (isEditing) {
      try {
        await authApi.put("/customer/profile/update", formData);
        setIsEditing(false);
        setAlert({
        title: "Profile Updated !",
        description: "Your profile details updated successfully.",
        status: true,
        buttonText: "Ok",
        onClose: handleClose,
        cancel: handleClose
      })
      } catch (error) {
        setAlert({
        title: "Error in Profile Update !",
        description: "Something gone wrong to update profile try again after sometimes.",
        status: true,
        buttonText: "Ok",
        onClose: handleClose,
        cancel: handleClose
      })
        console.error("Error updating profile:", error);
      }
    } else {
      setIsEditing(true);
    }
  };
if(loading)
    return <Loading />

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <CustomAlert
              title={alert.title}
              description={alert.description}
              status={alert.status}
              buttonText={alert.buttonText}
              onClose={alert.onClose}
            />

      <div className="md:col-span-1 flex justify-between">
        <div className="px-4 sm:px-0">
          <h3 className="text-xl font-medium text-gray-900">Profile Information</h3>
          <p className="mt-1 text-gray-600">
            Update your account's profile information and email address.
          </p>
        </div>
      </div>

      <div className="mt-5 md:col-span-2 md:mt-0">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-t-md">
            <div className="grid grid-cols-6 gap-6">
              {/* Profile Picture */}
              <div className="col-span-6 sm:col-span-4">
                <input id="photo" type="file" className="hidden"></input>
                <div className="mt-2">
                  <img
                    src={`https://ui-avatars.com/api/?bold=true&name=${encodeURIComponent(formData.name)}&color=4c51bf&background=82efe3`}
                    className="h-20 w-20 rounded-full object-cover"
                  />

                </div>
                <button type="button" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:text-gray-800 active:bg-gray-50 disabled:opacity-25 transition mr-2 mt-2">
                  Select A New Photo </button>
              </div>

              {/* Name */}
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] ${isEditing ? "text-gray-800 border-gray-400" : "text-gray-600"
                    } outline-none`}
                />
              </div>

              {/* Email */}
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                />
              </div>

              {/* Mobile */}
              <div className="col-span-6 sm:col-span-4">
                <label className="block text-sm font-semibold text-gray-700">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  disabled={true}
                  className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                />
              </div>

              {/* location */}
              <div className="col-span-6 sm:col-span-4 sm:flex sm:gap-4 space-y-6 sm:space-y-0">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] ${isEditing ? "text-gray-800 border-gray-400" : "text-gray-600"
                      } outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] ${isEditing ? "text-gray-800 border-gray-400" : "text-gray-600"
                      } outline-none`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] ${isEditing ? "text-gray-800 border-gray-400" : "text-gray-600"
                      } outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex items-center justify-end bg-gray-50 px-4 py-3 text-end shadow sm:rounded-b-md">
            <button
              type="button"
              onClick={handleEditOrSave}
              className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium tracking-wide text-white transition ${isEditing ? "bg-green-600 hover:bg-green-500" : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              disabled={loading}
            >
              {isEditing ? "Save Changes" : "Edit Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileInfo;