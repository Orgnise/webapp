import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helper/app-routes";
import useLocalStorage from "../../../hooks/use-local-storage";
import CustomDropDown from "../../../components/custom_dropdown";
import Logo from "../../../components/atom/logo";

const Nav = () => {
  const [user, setUser] = useLocalStorage("user");
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser({});
    navigate(AppRoutes.login);
    window.location.reload();
  };

  return (
    <div className="flex items-center place-content-between w-full">
      <div className="flex items-center flex-shrink-0  w-64">
        <Logo />
      </div>

      <div className="">
        {
          //👇🏻 if user is logged in, show logout button
          user && Object.keys(user).length !== 0 ? (
            <div className="flex items-center space-x-4 ">
              <CustomDropDown
                button={
                  <div className="flex items-center place-content-center font-bold text-lg h-10 w-10 rounded-full bg-teal-200 text-teal-500 hover:text-teal-700">
                    {user.name[0].toUpperCase()}
                  </div>
                }
              >
                <div className="bg-white px-3 py-3">
                  <div className="px-4 py-2 hover:bg-slate-100 rounded">
                    <p className="cursor-pointer text-slate-700 ">
                      {user.name}
                    </p>
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-red-200 rounded"
                    onClick={handleLogout}
                  >
                    <p className="cursor-pointer text-red-700 hover:text-red-500 ">
                      Logout
                    </p>
                  </div>
                </div>
              </CustomDropDown>
            </div>
          ) : (
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded-md my-2"
              onClick={() => {
                window.location.href = AppRoutes.login;
              }}
            >
              Login
            </button>
          )
        }
      </div>
    </div>
  );
};
export default Nav;
