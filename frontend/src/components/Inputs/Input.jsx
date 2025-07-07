import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-4">
      {label && (
        <label className="text-sm text-slate-800 block mb-1">{label}</label>
      )}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none border border-gray-700 px-3 py-2 rounded"
          value={value}
          onChange={(e) => onChange?.(e)}
        />
        {isPassword && (
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer text-slate-600"
          >
            {showPassword ? (
              <FaRegEyeSlash className="text-lg cursor-pointer " />
            ) : (
              <FaRegEye className="text-lg cursor-pointer" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
