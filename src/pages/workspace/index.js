import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import WorkSpaceLayout from "./layout/workspace-layout";
import ProjectsPage from "./pages/projects";
import TeamPage from "./pages/team";
import WorkspacePageView from "./workspace.page";

function WorkSpacePage() {
  return (
    <div>
      <WorkSpaceLayout />
    </div>
  );
}
export default WorkSpacePage;
