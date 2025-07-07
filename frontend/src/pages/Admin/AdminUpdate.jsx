import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImages";
const AdminUpdate = () => {
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    profileImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getProfile = () => {
    try {
      const { name, email, profileImageUrl } = user;
      setUserData((prev) => ({
        ...prev,
        name,
        email,
        profileImageUrl: profileImageUrl || "",
      }));
    } catch (err) {
      console.error("Profile fetch error", err);
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview image immediately
    setUserData((prev) => ({
      ...prev,
      image: file,
      profileImageUrl: URL.createObjectURL(file),
    }));

    try {
      const imageUploadRes = await uploadImage(file);
      const uploadedUrl = imageUploadRes.imageUrl || "";

      setUserData((prev) => ({
        ...prev,
        profileImageUrl: uploadedUrl,
      }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!userData.name.trim() || !userData.email.trim()) {
      return setError("Name and Email are required.");
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    if (userData.password) formData.append("password", userData.password);
    if (userData.image) formData.append("image", userData.image);

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        API_PATHS.USERS.UPDATE_USER(user._id),
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile updated successfully");
      updateUser({ ...user, ...response.data }); // update context
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Update error", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="mt-6 max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

        <div className="mb-3">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Leave blank to keep current"
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {userData.profileImageUrl && (
            <img
              src={userData.profileImageUrl}
              alt="Profile Preview"
              className="mt-2 h-20 w-20 rounded-full object-cover"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          className="add-btn mt-4"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default AdminUpdate;
