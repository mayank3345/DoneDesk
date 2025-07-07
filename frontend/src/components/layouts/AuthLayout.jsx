import React from "react";
import UIBG from "../../assets/images/bg-2.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-3xl font-medium text-black">Task Manager</h2>
        {children}
      </div>

      <div className="hidden md:flex md:w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden">
        <img src={UIBG} className=" w-[100%]" />
      </div>
    </div>
  );
};

export default AuthLayout;
