import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImages";

const SignUp = () => {
  const [profile, setProfile] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter Fullname");
      return;
    }

    // ✅ Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // ✅ Validate password
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(""); // Clear error if all good

    //Api call for signup

    try {
      //upload image if present
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
      });
      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        //redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong Please try again ");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <div className="bg-blue-300 p-12 rounded-3xl shadow-2xl">
          <h3 className="text-xl font-semibold text-black">
            Create an Account
          </h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">
            Join us today by entering your details below.
          </p>
          <form onSubmit={handleSignUp}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full Name"
                placeholder="Aditya Singh"
                type="text"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
              />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                placeholder="Enter Your Password"
                type="password"
              />
              <Input
                value={adminInviteToken}
                onChange={(e) => setAdminInviteToken(e.target.value)}
                label="Admin Invite Token"
                placeholder="Enter 10 digit Code"
                type="text"
              />
            </div>
            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
            <button type="submit" className="btn-primary w-full">
              SIGNUP
            </button>
            <p className="text-[13px] text-slate-800 mt-3">
              Already have an account?{" "}
              <Link
                className="font-medium text-primary underline cursor-pointer"
                to="/login"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
