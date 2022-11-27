import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import toast from "react-hot-toast";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ListView, TableBody } from "../../../../components/compound/list-view";
import FIcon from "../../../../components/ficon";
import ModalForm from "../../../../components/modal";
import { SocketEvent } from "../../../../constant/socket-event-constant";
import { AppRoutes } from "../../../../helper/app-routes";
import { useAppService } from "../../../../hooks/use-app-service";
import useLocalStorage from "../../../../hooks/use-local-storage";
import useSocket from "../../../../hooks/use-socket.hook";
import AddOrganization from "../../../organization/component/add-organization";
import AddProject from "./create-project";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [tempProject, setTempProject] = useState([]);
  const [loading, setLoading] = useState();
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useLocalStorage("user");
  const createProject = SocketEvent.organization.project.create;
  const socket = useSocket([createProject], (event, data) => {
    if (event === createProject) {
      setTempProject((prev) => [...prev, data]);
      setProjects((prev) => [...prev, data]);
    }
  });
  const { projectService } = useAppService();

  const params = useParams();
  const id = params.id;

  // Fetch projects list in which authenticated user is member | owner | admin
  useEffect(() => {
    if (user && id) {
      setLoading(true);
      projectService
        .getAllProjects(id)
        .then(({ Projects }) => {
          // console.log("res", companies);
          setProjects(Projects);
          setTempProject(Projects);
        })
        .catch(({ response }) => {
          console.log(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, id]);

  // Sort organization by created date
  function sortBy(val) {
    if (val === "Latest") {
      const sortedOrganization = projects.sort((a, b) => {
        return moment(b.createdAt).diff(moment(a.createdAt));
      });
      setProjects(sortedOrganization);
      setTempProject(sortedOrganization);
    } else if (val === "Oldest") {
      const sortedOrganization = projects.sort((a, b) => {
        return moment(a.createdAt).diff(moment(b.createdAt));
      });
      setProjects(sortedOrganization);
      setTempProject(sortedOrganization);
    }
  }

  // Filter organization by name
  function filterByQuery(query) {
    const filteredOrganization = projects.filter((org) => {
      return org.name.toLowerCase().includes(query.toLowerCase());
    });
    setTempProject(filteredOrganization);
  }
  return (
    <section className="flex flex-col space-y-6">
      <p className="text-3xl font-bold">Projects</p>
      <div className="bg-white shadow mb-4 py-4 md:py-7  md:px-8 xl:px-10 ">
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
            title={"Add new Project"}
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
                  Add Project
                </p>
              </button>
            }
          >
            <AddProject setVisible={setVisible} orgId={id} />
          </ModalForm>
        </div>
        {loading && <div>Loading...</div>}
        <div className="mt-7 overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-sm leading-none uppercase ">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Members</th>
                <th className="text-left px-4 py-3">Created on</th>
                <th className="text-left px-4 py-3"></th>
                <th className="text-left px-1 py-3"></th>
              </tr>
            </thead>
            <tbody>
              <TableBody
                items={tempProject}
                renderItem={(org, index) => (
                  <ProjectRow key={index} org={org} index={index} />
                )}
                placeholder={
                  <tr>
                    <td className="text-center px-4 pt-6" colSpan="7">
                      No organization found
                    </td>
                  </tr>
                }
                noItemsElement={
                  <tr>
                    <td className="text-center px-4 pt-6" colSpan="7">
                      No organization found
                    </td>
                  </tr>
                }
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ org, index }) {
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
export default ProjectsPage;
