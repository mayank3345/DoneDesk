import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader"; // Your custom loading spinner

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Full Page Loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* Login Card */}
        <div className="lg:w-[70%] md:w-full h-3/4 flex flex-col justify-center z-10">
          <div className="bg-blue-300 p-12 rounded-3xl shadow-2xl relative">
            <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
            <p className="text-xs text-slate-700 mt-[5px] mb-6">
              Please enter your details to log in
            </p>

            <form onSubmit={handleLogin}>
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
                disabled={isLoading}
              />

              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 Characters"
                type="password"
                disabled={isLoading}
              />

              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "LOGIN"}
              </button>

              <p className="text-[13px] text-slate-800 mt-3">
                Don't have an account?{" "}
                <Link
                  className="font-medium text-primary underline"
                  to="/signup"
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  SignUp
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
