import React, { useState, useEffect } from "react";
import { MasterPageLayout } from "../layout/master-page.layout";
import { SidebarPageLayout } from "../layout/sidebar.page.layout";
import OrganizationsPage from "../organization/organizations.page";
import Nav from "../task/component/nav";
import SidebarComponent from "./sidebar.component";

function DashBoardPage() {
  return (
    <div>
      <MasterPageLayout navbar={<Nav />} sidebar={<SidebarComponent />}>
        <OrganizationsPage />
      </MasterPageLayout>
    </div>
  );
}
export default DashBoardPage;
