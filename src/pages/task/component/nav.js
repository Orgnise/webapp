import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helper/app-routes";
import CustomDropDown from "../../../components/custom_dropdown";
import Logo from "../../../components/atom/logo";
import useAuth from "../../../hooks/use-auth";
import SvgIcon from "../../../components/svg-icon/svg-icon";
import useTheme from "../../workspace/hook/use-theme.hook";
import Label from "../../../components/typography";

const Nav = () => {
  const auth = useAuth();
  const user = auth.user;
  const navigate = useNavigate();
  const { toggleTheme, darkMode } = useTheme();

  const handleLogout = () => {
    auth.signOut(() => navigate("/"));
  };

  return (
    <div className="flex items-center place-content-between w-full">
      <div className="flex items-center flex-shrink-0  w-64">
        <Logo />
      </div>

      <div className="">
        {
          // 👇🏻 if user is logged in, show logout button
          user && Object.keys(user).length !== 0 && (
            <div className="flex items-center space-x-4 ">
              <SvgIcon
                icon="LightDark"
                size={5}
                className="cursor-pointer"
                variant={!darkMode ? "dark" : "light"}
                onClick={() => {
                  toggleTheme();
                }}
              />
              <CustomDropDown
                button={
                  <div className="flex items-center place-content-center font-bold text-lg h-10 w-10 rounded-full bg-teal-200 text-teal-500 hover:text-teal-700">
                    {/* {user.name[0].toUpperCase()} */}
                  </div>
                }>
                <div className="bg-card px-3 py-3 border theme-border rounded">
                  <div className="px-4 py-2 hover:bg-onSurface rounded">
                    <Label size="body1" variant="t3" className="cursor-pointer">
                      {user.name}
                    </Label>
                  </div>
                  <div
                    className="px-4 py-2 hover:bg-red-200 rounded"
                    onClick={handleLogout}>
                    <p className="cursor-pointer text-red-700 hover:text-red-500 ">
                      Logout
                    </p>
                  </div>
                </div>
              </CustomDropDown>
            </div>
          )
        }
      </div>
    </div>
  );
};
export default Nav;
