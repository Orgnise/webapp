import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Nav from "../task/component/nav";

import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import { SocketEvent } from "../../constant/socket-event-constant";
import useSocket from "../../hooks/use-socket.hook";
import { NavbarLayout } from "../layout";
import Button from "../../components/atom/button";
import CustomDropDown from "../../components/custom_dropdown";
import { ListView } from "../../components/compound/list-view";
import useAuth from "../../hooks/use-auth";
import ErrorPage from "../error/error-page";
import WorkSpacePage from "../workspace";
import { WorkspaceProvider } from "../workspace/provider/workspace.provider";
import SvgIcon from "../../components/svg-icon/svg-icon";

export default function AllTeamsPage() {
  return (
    <WorkspaceProvider>
      <Routes>
        <Route path={"/"} element={<Teams />} />
        <Route path=":id" element={<WorkSpacePage />} />
        <Route path={":id/*"} errorElement={<ErrorPage />}>
          {/* <Route path="" element={<WorkSpacePage />}></Route> */}
        </Route>
        <Route path="/:id/:slug" element={<WorkSpacePage />} />
        <Route path=":id/:slug/:item" element={<WorkSpacePage />} />
      </Routes>
    </WorkspaceProvider>
  );
}

function Teams() {
  const [team, setOrganization] = useState([]);
  const [loading, setLoading] = useState();
  const { teamService } = useAppService();

  const { user } = useAuth();
  const navigate = useNavigate();

  useSocket([SocketEvent.team.create], (event, data) => {
    if (event === SocketEvent.team.create) {
      setOrganization((prev) => [...prev, data]);
      toast.success("Team created successfully", {
        position: "top-right",
      });
    }
  });

  // Fetch team list in which authenticated user is member | owner | admin
  useEffect(() => {
    if (user) {
      setLoading(true);
      teamService
        .getAllTeams()
        .then(({ teams }) => {
          setOrganization(teams);
        })
        .catch(({ response }) => {
          if (response && response.data) {
            console.log(response.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <div className="OrganizationList h-screen flex flex-col">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <section className="flex flex-col bg-white py-4 md:py-7  md:px-8 xl:px-10 h-full overflow-y-auto items-center">
        <div className="divide-y max-w-xl w-full px-2 sm:px-0 pt-28">
          <div className="flex flex-col  gap-5 ">
            <div className="flex">
              <h1 className="font-medium text-2xl flex-1 ">Team</h1>
              <Button
                label="Create Team"
                type="link"
                size="small"
                onClick={() => {
                  navigate(AppRoutes.team.create);
                }}
              />
            </div>
            <ListView
              items={team}
              loading={loading}
              noItemsElement={
                <div className="p-4 rounded bg-gray-100 text-xs text-slate-500">
                  You are not a member of any team yet. Create a new team or ask
                  someone to invite you to their team
                </div>
              }
              placeholder={
                <div className="animate-pulse p-4 rounded bg-gray-100 flex flex-col gap-2">
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-4 bg-gray-300 rounded w-11/12"></div>
                  <div className="h-2 bg-gray-300 rounded w-2/12"></div>
                </div>
              }
              renderItem={(org, index) => (
                <OrganizationRow key={index} org={org} />
              )}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function OrganizationRow({ org, index }) {
  return (
    <div className="flex items-center border-b-[1px] py-2 first:border-t border-gray-100 hover:bg-gray-50 cursor-pointer px-4">
      <div className=" mr-2 hover:cursor-pointer w-full">
        <div className="flex">
          <Link to={`/team/${org.meta.slug}`} className="flex-1">
            <h3 className="text-base text-gray-700">{org.name}</h3>
            <h5 className="text-xs text-gray-500">
              {org.members.length} team members
            </h5>
          </Link>
          <CustomDropDown
            button={<SvgIcon icon="VerticalEllipse" className="h-4" />}
          >
            <div className="text-left px-4 py-2 bg-white w-56 rounded-md">
              Team Settings
            </div>
          </CustomDropDown>
        </div>
      </div>
    </div>
  );
}
