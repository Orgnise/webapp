import React, { useState, useEffect } from "react";
import moment from "moment";
import Nav from "../task/component/nav";

import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Comments,
  getLoggedInRoute,
  getProtectedRoute,
  NoPageFound,
} from "../../helper/routes.helper";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";
import { useAppService } from "../../hooks/use-app-service";
import { SocketEvent } from "../../constant/socket-event-constant";
import useSocket from "../../hooks/use-socket.hook";
import FIcon from "../../components/ficon";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import AddOrganization from "./component/add-organization";
import ModalForm from "../../components/modal";
import OrganizationPage from "./detail/organization";
import Breadcrumb from "../../components/breadcrumb";
import { WithBreadcrumb } from "../../components/compound/withbreadcrumn";
// import OrganizationPage from "./detail/organization-info.page";

const AllOrganizationsList = () => {
  const params = useParams();
  const id = params.id;
  return (
    <WithBreadcrumb
      BCrumb={
        <Breadcrumb
          className="py-6"
          items={[
            {
              label: "Dashboard",
              link: "/",
            },
            {
              label: "Organizations",
              link: AppRoutes.organization.allOrganizations,
            },
          ]}
        />
      }
    >
      <OrganizationList />
    </WithBreadcrumb>
  );
};

export function OrganizationList() {
  const [organization, setOrganization] = useState([]);
  const [tempOrganization, setTempOrganization] = useState([]);
  const [loading, setLoading] = useState();
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useLocalStorage("user");
  const createOrganization = SocketEvent.organization.create;
  const [_, __, socket] = useSocket([], {});
  const { organizationService } = useAppService();

  // Fetch organization list in which authenticated user is member | owner | admin
  useEffect(() => {
    if (user) {
      setLoading(true);
      organizationService
        .getAllCompanies()
        .then(({ companies }) => {
          // console.log("res", companies);
          setOrganization(companies);
          setTempOrganization(companies);
        })
        .catch(({ response }) => {
          console.log(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  // Listen if any organization is created
  useEffect(() => {
    if (!socket || !socket.connected) return;
    socket.on(createOrganization, (data) => {
      setOrganization((prev) => [...prev, data]);
      setTempOrganization((prev) => [...prev, data]);
    });
    return () => {
      socket.off(createOrganization);
    };
  }, [socket]);

  // Sort organization by created date
  function sortBy(val) {
    if (val === "Latest") {
      const sortedOrganization = organization.sort((a, b) => {
        return moment(b.createdAt).diff(moment(a.createdAt));
      });
      setOrganization(sortedOrganization);
      setTempOrganization(sortedOrganization);
    } else if (val === "Oldest") {
      const sortedOrganization = organization.sort((a, b) => {
        return moment(a.createdAt).diff(moment(b.createdAt));
      });
      setOrganization(sortedOrganization);
      setTempOrganization(sortedOrganization);
    }
  }

  // Filter organization by name
  function filterByQuery(query) {
    const filteredOrganization = organization.filter((org) => {
      return org.name.toLowerCase().includes(query.toLowerCase());
    });
    setTempOrganization(filteredOrganization);
  }
  return (
    <section className="bg-white shadow mb-4 py-4 md:py-7  md:px-8 xl:px-10 ">
      <div className="sm:flex items-center justify-between">
        <div className="py-2 px-4 flex items-center border border-gray-200  leading-none cursor-pointer rounded">
          <FIcon icon={solid("search")} className="text-gray-400 mr-2" />
          <div className=" flex-grow  px-4">
            <input
              type="text"
              className="bg-transparent focus:outline-none w-full"
              placeholder="Filter by name"
              onChange={(e) => {
                console.log(e.target.value);
                filterByQuery(e.target.value);
              }}
            />
          </div>
        </div>
        <ModalForm
          title={"Add new Task"}
          className="w-full sm:w-2/3 md:w-2/4 lg:w-1/3"
          visible={visible}
          setVisible={setVisible}
          path={AppRoutes.addTask}
          button={
            <button
              onClick={() => setVisible(true)}
              className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 mt-4 sm:mt-0 inline-flex items-start justify-start px-6 py-3 bg-indigo-700 hover:bg-indigo-600 focus:outline-none rounded"
            >
              <p className="text-sm font-medium leading-none text-white">
                Add Organization
              </p>
            </button>
          }
        >
          <AddOrganization setVisible={setVisible} />
        </ModalForm>
      </div>
      {loading && <div>Loading...</div>}
      <div className="mt-7 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-sm leading-none uppercase ">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Admin</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3">Members</th>
              <th className="text-left px-4 py-3">Created on</th>
              <th className="text-left px-4 py-3"></th>
              <th className="text-left px-1 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tempOrganization.map((org, index) => (
              <OrganizationRow key={index} org={org} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OrganizationRow({ org, index }) {
  return (
    <tr
      key={index}
      tabIndex={index}
      className="focus:outline-none h-16 border-t border-gray-100 rounded"
    >
      <td className="">
        <div className="flex items-center pl-5">
          <a
            href={`organization/${org.id}`}
            className="text-base font-medium leading-none text-gray-700 mr-2 hover:underline hover:cursor-pointer"
          >
            {org.name}
          </a>
        </div>
      </td>
      <td className="pl-5">
        <div className="flex items-center">
          <FIcon className="text-slate-500" icon={regular("user")} />
          <p className="text-sm leading-none text-gray-600 ml-2">
            {org.createdBy.name}
          </p>
        </div>
      </td>
      <td className="pl-2">
        <div className="flex items-center">
          <p className="text-sm leading-none text-gray-600 ml-2">
            {org.description.length == 0
              ? "-"
              : org.description.substring(0, 40) + "..."}
          </p>
        </div>
      </td>
      <td className="pl-5">
        <div className="flex items-center">
          <FIcon
            icon={regular("user")}
            className="cursor-pointer p-1 rounded select-none "
            size="xs"
          />
          <span className="flex items-center ">{org.members.length}</span>
        </div>
      </td>

      <td className="pl-5">
        <div className="flex items-center">
          <FIcon
            icon={regular("calendar")}
            className="cursor-pointer p-1 rounded select-none"
            size="xs"
          />

          <p className="text-sm leading-none text-gray-600 ml-2">
            <span className=" text-slate-600">
              {moment(org.createdAt).format("DD MMM YY")}
            </span>
          </p>
        </div>
      </td>
      <td className="pl-5">
        <Link
          to={`/workspace/${org.id}`}
          className="px-2 py-1 rounded bg-teal-500 text-white  hover:shadow-lg"
        >
          View
        </Link>
      </td>
      <td>
        <div className="relative px-5 pt-2">
          <button
            className="focus:ring-2 rounded-md focus:outline-none"
            // onClick={dropdownFunction(org.id)}
            role="button"
            aria-label="option"
          >
            <svg
              className="dropbtn"
              // onClick={dropdownFunction()}
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M4.16667 10.8332C4.62691 10.8332 5 10.4601 5 9.99984C5 9.5396 4.62691 9.1665 4.16667 9.1665C3.70643 9.1665 3.33334 9.5396 3.33334 9.99984C3.33334 10.4601 3.70643 10.8332 4.16667 10.8332Z"
                stroke="#9CA3AF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M10 10.8332C10.4602 10.8332 10.8333 10.4601 10.8333 9.99984C10.8333 9.5396 10.4602 9.1665 10 9.1665C9.53976 9.1665 9.16666 9.5396 9.16666 9.99984C9.16666 10.4601 9.53976 10.8332 10 10.8332Z"
                stroke="#9CA3AF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M15.8333 10.8332C16.2936 10.8332 16.6667 10.4601 16.6667 9.99984C16.6667 9.5396 16.2936 9.1665 15.8333 9.1665C15.3731 9.1665 15 9.5396 15 9.99984C15 10.4601 15.3731 10.8332 15.8333 10.8332Z"
                stroke="#9CA3AF"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <div
            id="dropdown-content"
            className=" bg-white shadow w-24 absolute z-30 right-0 mr-6 hidden"
          >
            <div
              tabIndex=""
              className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
            >
              <p>Edit</p>
            </div>
            <div
              tabIndex=""
              className="focus:outline-none focus:text-indigo-600 text-xs w-full hover:bg-indigo-700 py-4 px-4 cursor-pointer hover:text-white"
            >
              <p>Delete</p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default AllOrganizationsList;
