import React, { useState, useEffect } from "react";
import cx from "classnames";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { Link, NavLink, useParams } from "react-router-dom";
import useLocalStorage from "../../../hooks/use-local-storage";
import FIcon from "../../../components/ficon";
import SidebarComponent from "../../super-admin/component/sidebar.component";
import { SidebarPageLayout } from "../../layout";
import { AppRoutes } from "../../../helper/app-routes";

function WorkspaceSidebarLayout() {
  const [user, setUser] = useLocalStorage("user");
  const params = useParams();
  const id = params.id;

  return (
    <>
      <SidebarPageLayout
        header={<div className="h-4"></div>}
        children={
          <div className="flex flex-col space-y-2">
            <Link
              to={AppRoutes.organization.allOrganizations}
              className="hover:bg-gray-100  group flex items-center space-x-2 px-2  lg:mx-2 py-2 text-sm font-medium rounded-md"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              <span className="hidden lg:block">Organization</span>
            </Link>

            <NavLink
              to={`/workspace/${id}/project`}
              className={(data) =>
                cx(
                  " group flex items-center space-x-2 px-2  lg:mx-2 py-2 text-sm font-medium rounded-md",
                  {
                    "bg-gray-100 text-slate-700": data.isActive,
                    "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                      !data.isActive,
                  }
                )
              }
            >
              <FIcon icon={solid("users")} />
              <span className="hidden lg:block">Projects</span>
            </NavLink>
            <NavLink
              to={`/workspace/${id}/team`}
              className={(data) =>
                cx(
                  " group flex items-center space-x-2 px-2  lg:mx-2 py-2 text-sm font-medium rounded-md",
                  {
                    "bg-gray-100 text-slate-700": data.isActive,
                    "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                      !data.isActive,
                  }
                )
              }
            >
              <FIcon icon={solid("users")} />
              <span className="hidden lg:block">Team</span>
            </NavLink>
          </div>
        }
        footer={
          <div className="Sidebar-footer bg-slate-200 px-2 lg:px-4 py-3 border-t-4 ">
            <div>
              <Link to="#" className="flex space-x-3 items-center">
                <FIcon
                  icon={solid("user")}
                  className="bg-gray-300 rounded-full p-2"
                />
                <span className="hidden lg:block">{user && user.name}</span>
              </Link>
            </div>
          </div>
        }
      ></SidebarPageLayout>
    </>
  );
}
export default WorkspaceSidebarLayout;
