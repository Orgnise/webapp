import React, { useState } from "react";
import {
  solid,
  regular,
  icon,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../helper/app-routes";
import useLocalStorage from "../../../hooks/use-local-storage";
import CustomDropDown from "../../../components/custom_dropdown";
import Dropdown from "../../../components/dropdown";
import FIcon from "../../../components/ficon";
import ModalForm from "../../../components/modal";
import AddTask from "./add-task";

const Nav = () => {
  const [user, setUser] = useLocalStorage("user");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser({});
    navigate(AppRoutes.login);
    window.location.reload();
  };

  React.useEffect(() => {
    console.log("visible", visible);
  }, [visible]);

  return (
    <nav className="w-full bg-slate-100 flex-none">
      <div className="max-w-screen-xl flex items-center place-content-between m-auto h-14 px-2">
        <h2 className="font-bold text-lg">React Kanban</h2>

        <div className="">
          {//👇🏻 if user is logged in, show logout button
          user && Object.keys(user).length !== 0 ? (
            <div className="flex items-center space-x-4 ">
              <div>
                <ModalForm
                  title={"Add new Task"}
                  className="w-full sm:w-2/3 md:w-2/4 lg:w-1/3"
                  visible={visible}
                  setVisible={setVisible}
                  path={AppRoutes.addTask}
                  button={
                    <FIcon
                      icon={solid("plus")}
                      className="cursor-pointer border border-slate-400 p-2 mt-1 rounded select-none"
                      size="sm"
                    />
                  }
                >
                  <AddTask setVisible={setVisible} />
                </ModalForm>
              </div>
              <CustomDropDown
                button={
                  <div className="flex items-center place-content-center font-bold text-lg h-10 w-10 rounded-full bg-blue-200">
                    {user.username[0].toUpperCase()}
                  </div>
                }
              >
                <div className="bg-white px-3 py-3">
                  <div className="px-4 py-2 hover:bg-slate-100 rounded">
                    <p className="cursor-pointer text-slate-700 ">
                      @{user.username}
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
          )}
        </div>
      </div>
    </nav>
  );
};
export default Nav;
