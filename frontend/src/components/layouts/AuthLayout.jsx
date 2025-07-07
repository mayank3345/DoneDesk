import React from "react";
import UIBG from "../../assets/images/bg-2.jpg";
import Logo from "../../assets/images/Logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen  md:w-[60vw] px-12 pt-8">
        <div className="flex gap-3 ">
          <div>
            <img src={Logo} alt="logo" className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-medium text-black">DoneDesk</h2>
        </div>
        {children}
      </div>

      <div className="hidden md:flex md:w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden">
        <img src={UIBG} className=" w-[100%]" />
      </div>
    </div>
  );
};

export default AuthLayout;
