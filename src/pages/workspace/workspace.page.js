import React, { useState, useEffect } from "react";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { useAppService } from "../../hooks/use-app-service";
import { Fold } from "../../helper/typescript-utils";
import useSocket from "../../hooks/use-socket.hook";
import moment from "moment";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { AppRoutes } from "../../helper/app-routes";
import FIcon from "../../components/ficon";
import ModalForm from "../../components/modal";
import useAuth from "../../hooks/use-auth";

export default function WorkspacePageView() {
  const [organization, setOrganization] = useState({});
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;
  const { organizationService } = useAppService();
  const { user } = useAuth();

  // Fetch organization list in which authenticated user is member | owner | admin
  useEffect(() => {
    // console.log("Fetching organization detail");
    if (user) {
      setLoading(true);
      organizationService
        .getOrganizationById(id)
        .then(({ organization }) => {
          // console.log("res", organization);
          setOrganization(organization);
        })
        .catch(({ error }) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="pt-4">
      <div className="flex flex-col">
        {loading ? (
          <>loading..</>
        ) : (
          <p className="text-3xl font-bold mb-4">Workspace</p>
        )}

        <Fold
          value={organization.members}
          ifPresent={(v) => <TeamList teams={v} />}
          ifAbsent={() => <div>Nothing</div>}
        />
        {/* <TasksContainer /> */}
        <div className="h-screen"></div>
      </div>
    </div>
  );
}

function TeamList({ teams }) {
  const [members, setMembers] = useState(teams);
  const [tempMembers, setTempMembers] = useState(teams);
  const [loading, setLoading] = useState();
  const [visible, setVisible] = useState(false);

  const socket = useSocket([], {});
  const { organizationService } = useAppService();

  // Listen if any organization is created
  useEffect(() => {
    if (!socket || !socket.connected) return;
    // socket.on(createOrganization, (data) => {
    //   setMembers((prev) => [...prev, data]);
    //   setTempMembers((prev) => [...prev, data]);
    // });
    // return () => {
    //   socket.off(createOrganization);
    // };
  }, [socket]);

  // Sort organization by created date
  function sortBy(val) {
    if (val === "Latest") {
      const sortedOrganization = members.sort((a, b) => {
        return moment(b.createdAt).diff(moment(a.createdAt));
      });
      setMembers(sortedOrganization);
      setTempMembers(sortedOrganization);
    } else if (val === "Oldest") {
      const sortedOrganization = members.sort((a, b) => {
        return moment(a.createdAt).diff(moment(b.createdAt));
      });
      setMembers(sortedOrganization);
      setTempMembers(sortedOrganization);
    }
  }

  // Filter organization by name
  function filterByQuery(query) {
    const filteredOrganization = members.filter((data) => {
      return data.user.name.toLowerCase().includes(query.toLowerCase());
    });
    setTempMembers(filteredOrganization);
  }
  return (
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
                Invite Members
              </p>
            </button>
          }
        >
          {/* <AddOrganization setVisible={setVisible} /> */}
          <></>
        </ModalForm>
      </div>
      {loading && <div>Loading...</div>}
      <div className="mt-7 overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="text-sm leading-none uppercase ">
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3"></th>
              <th className="text-left px-1 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {tempMembers.map((data, index) => (
              <MemberRow key={index} data={data} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MemberRow({ data, index }) {
  const { role, user: member } = data;
  return (
    <tr
      key={index}
      tabIndex={index}
      className="focus:outline-none h-16 border-t border-gray-100 rounded"
    >
      <td className="">
        <div className="flex items-center pl-5">
          <a
            href={`organization/${"member.name"}`}
            className="text-base font-medium leading-none text-gray-700 mr-2 hover:underline hover:cursor-pointer"
          >
            {member.name}
          </a>
        </div>
      </td>
      <td className="pl-5">
        <div className="flex items-center">
          <FIcon className="text-slate-500" icon={solid("mail-forward")} />
          <p className="text-sm leading-none text-gray-600 ml-2">
            {member.email}
          </p>
        </div>
      </td>
      <td className="pl-5">
        <div className="flex items-center">
          <span
            className={cx("flex items-center lowercase px-2 rounded-md", {
              "text-green-900 bg-green-200 ": role === "Admin",
              "text-blue-900 bg-blue-200 ": role === "User",
            })}
          >
            {role}
          </span>
        </div>
      </td>
      <td className="pl-2">
        <div className="flex items-center">
          <p className="text-sm leading-none text-gray-600 ml-2">{member.id}</p>
        </div>
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
