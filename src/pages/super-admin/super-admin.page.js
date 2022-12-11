import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import useLocalStorage from "../../hooks/use-local-storage";
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
  const [user, setUser] = useLocalStorage("user");
  const { organizationService } = useAppService();
  const navigate = useNavigate();

  // Get user initial data
  useEffect(() => {
    if (!user) return;
    organizationService
      .getAllOrganizations()
      .then(({ companies }) => {
        // If user has no organization, redirect to onboarding page
        if (companies.length === 0) {
          navigate(AppRoutes.organization.create);
        } else {
          navigate(AppRoutes.users.myOrganization);
        }
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
      })
      .finally(() => {});
  }, [user]);

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
