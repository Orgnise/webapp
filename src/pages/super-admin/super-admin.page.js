import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import { MasterPageLayout } from "../layout/master-page.layout";
import { SidebarPageLayout } from "../layout/sidebar.page.layout";
import AllOrganizationsList, {
  OrganizationList,
} from "../organization/all-organizations-list.page";
import OrganizationPage from "../organization/detail/organization";
import Nav from "../task/component/nav";
import SidebarComponent from "./component/sidebar.component";
import SuperAdminHomePageView from "./super-admin-home-view";

function SuperAdminPage() {
  return (
    <div>
      <MasterPageLayout navbar={<Nav />} sidebar={<SidebarComponent />}>
        <Routes>
          <Route
            path={AppRoutes.dashboard}
            element={<SuperAdminHomePageView />}
          />
          <Route
            path={AppRoutes.organization.detail}
            element={<OrganizationPage />}
          />
          <Route
            path={AppRoutes.organization.allOrganizations}
            element={<AllOrganizationsList />}
          />
        </Routes>
      </MasterPageLayout>
    </div>
  );
}
export default SuperAdminPage;
