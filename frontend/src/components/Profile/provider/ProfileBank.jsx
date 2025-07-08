import { useEffect, useState } from "react";
import authApi from '../../../config/auth-config';
import CustomAlert from "../../CustomAlert";
import Loading from "../../Loading";

function ProfileInfo() {
    const [formData, setFormData] = useState({
        holder_name: "",
        account_number: "",
        account_type: "",
        ifsc_code: "",
        bank_name: "",
        branch: "",
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
                const response = await authApi.get("/provider/bank");
                console.log(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching bank details:", error);
                setAlert({
                    title: "Error Loading Bank Details",
                    description: "Failed to load bank information. Please try again.",
                    status: true,
                    buttonText: "Ok",
                    onClose: handleClose,
                    cancel: handleClose
                });
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
                const res = await authApi.put("/provider/bank", formData);
                console.log(res);

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
    if (loading)
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
                    <h3 className="text-xl font-medium text-gray-900">Banking Information</h3>
                    <p className="mt-1 text-gray-600">
                        Update your account's banking information to get monetized.
                    </p>
                </div>
            </div>

            <div className="mt-5 md:col-span-2 md:mt-0">
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="bg-white px-4 py-5 shadow sm:p-6 sm:rounded-t-md">
                        <div className="grid grid-cols-6 gap-6">
                            {/* Name */}
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700">Account Holder Name</label>
                                <input
                                    type="text"
                                    name="holder_name"
                                    value={formData.holder_name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] ${isEditing ? "text-gray-800 border-gray-400" : "text-gray-600"
                                        } outline-none`}
                                />
                            </div>

                            {/* Email */}
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700">Account Number</label>
                                <input
                                    type="number"
                                    name="account_number"
                                    value={formData.account_number}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                                />
                            </div>

                            {/* Mobile */}
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700">Account Type</label>
                                <input
                                    type="text"
                                    name="account_type"
                                    value={formData.account_type}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                                />
                            </div>

                            {/* IFSC code */}
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifsc_code"
                                    value={formData.ifsc_code}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                                />
                            </div>

                            {/* Bank name */}
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700">Bank Name</label>
                                <input
                                    type="text"
                                    name="bank_name"
                                    value={formData.bank_name}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                                />
                            </div>

                            {/* Branch */}
                            <div className="col-span-6 sm:col-span-4">
                                <label className="block text-sm font-semibold text-gray-700">Branch Name</label>
                                <input
                                    type="text"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleChange}
                                    disabled={true}
                                    className={`block w-full tracking-wide border-b border-gray-300 pl-1 text-lg sm:text-[16px] text-gray-600 outline-none`}
                                />
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