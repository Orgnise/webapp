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
import Label from "../../components/typography";
import CreateWorkspacePage from "../workspace/pages/create/create-workspace";

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
        <Route
          path=":slug/create-workspace"
          element={<CreateWorkspacePage />}
        />
      </Routes>
    </WorkspaceProvider>
  );
}

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState();
  const { teamService } = useAppService();

  const { user } = useAuth();
  const navigate = useNavigate();

  useSocket([SocketEvent.team.create], (event, data) => {
    if (event === SocketEvent.team.create) {
      setTeams((prev) => [...prev, data]);
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
          setTeams(teams);
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
    <div className="OrganizationList h-screen flex flex-col bg-default">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <section className="flex flex-col py-4 md:py-7 md:px-8 xl:px-10 h-full overflow-y-auto items-center">
        <div className="divide-y max-w-xl w-full px-2 sm:px-0 pt-28">
          <div className="flex flex-col  gap-5 ">
            <div className="flex">
              <Label size="h2" variant="t3" className="flex-1">
                Team
              </Label>
              <Button
                label="Create Team"
                type="link"
                size="base"
                onClick={() => {
                  navigate(AppRoutes.team.create);
                }}
              />
            </div>
            <ListView
              items={teams}
              loading={loading}
              noItemsElement={
                <div className="p-4 rounded bg-surface text-xs">
                  You are not a member of any team yet. Create a new team or ask
                  someone to invite you to their team
                </div>
              }
              placeholder={
                <div className="animate-pulse p-4 rounded bg-surface flex flex-col gap-2">
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
                  <div className="h-4" />
                  <div className="h-8 bg-onSurface rounded w-11/12"></div>
                  <div className="h-8 bg-onSurface rounded w-2/12"></div>
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
    <div className="flex items-center py-2 first:border-t theme-border hover:bg-surface cursor-pointer px-4">
      <div className=" mr-2 hover:cursor-pointer w-full">
        <div className="flex">
          <Link to={`/team/${org.meta.slug}`} className="flex-1">
            <Label className="block" variant="s1">
              {org.name}
            </Label>
            <Label size="caption" variant="cap">
              {org.members.length} team members
            </Label>
          </Link>
          <CustomDropDown
            button={<SvgIcon icon="VerticalEllipse" className="h-4" />}>
            <Label className="text-left px-4 py-2 bg-surface w-56 rounded-md">
              Team Settings
            </Label>
          </CustomDropDown>
        </div>
      </div>
    </div>
  );
}
