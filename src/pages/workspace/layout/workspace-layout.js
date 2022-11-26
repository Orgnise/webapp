import React, { useState, useEffect } from "react";
import WorkspacePageView from "../workspace.page";
import { MasterPageLayout } from "../../layout";
import Nav from "../../task/component/nav";
import WorkspaceSidebarLayout from "./workspace-sidebar.component";
import { Route, Routes, useParams } from "react-router-dom";
import { AppRoutes } from "../../../helper/app-routes";
import ProjectsPage from "../pages/projects";
import TeamPage from "../pages/team";
import Breadcrumb from "../../../components/breadcrumb";

function WorkSpaceLayout() {
  const params = useParams();
  const id = params.id;

  const path = window.location.pathname;
  const pathArray = path.split("/").filter((item) => item !== "");

  console.log("pathNameArray", pathArray);

  return (
    <div>
      <MasterPageLayout navbar={<Nav />} sidebar={<WorkspaceSidebarLayout />}>
        <div>
          <Breadcrumb
            className="py-6"
            items={[
              {
                label: "Organizations",
                link: AppRoutes.organization.allOrganizations,
              },
              {
                label: `${id}`,
                link: `/workspace/${id}`,
              },
            ]}
          />
          <Routes>
            <Route path={"/project"} element={<ProjectsPage />} />
            <Route path={"team"} element={<TeamPage />} />
          </Routes>
        </div>
      </MasterPageLayout>
    </div>
  );
}
export default WorkSpaceLayout;
