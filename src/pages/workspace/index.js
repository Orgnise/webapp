import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { ListView } from "../../components/compound/list-view";
import FIcon from "../../components/ficon";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import useLocalStorage from "../../hooks/use-local-storage";
import WorkSpaceLayout from "./layout/workspace-layout";
import ProjectsPage from "./pages/projects";
import TeamPage from "./pages/team";
import WorkspacePageView from "./workspace.page";

function WorkSpacePage() {
  const [orgs, setOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { organizationService } = useAppService();
  const [user, setUser] = useLocalStorage("user");
  const navigation = useNavigate();

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    organizationService
      .getAllOrganizations()
      .then(({ companies }) => {
        if (companies.length == 0) {
          navigation(AppRoutes.onboard.step1);
        }
        setOrgs(companies);
      })
      .catch((err) => {
        // if (err.response && err.response?.data) {
        //   console.log(err.response.data);
        // } else {
        // }
        console.log(err);

        toast.error("Failed to load organizations");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);
  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          Loading...
        </div>
      ) : (
        <WorkSpaceLayout />
      )}
    </>
  );
}

export default WorkSpacePage;
