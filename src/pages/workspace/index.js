import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import cx from "classnames";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import Button from "../../components/atom/button";
import { ListView } from "../../components/compound/list-view";
import CustomDropDown from "../../components/custom_dropdown";
import FIcon from "../../components/ficon";
import { SlideModal } from "../../components/molecule/slide-modal";
import { AppRoutes } from "../../helper/app-routes";
import { Fold } from "../../helper/typescript-utils";
import { useAppService } from "../../hooks/use-app-service";
import useLocalStorage from "../../hooks/use-local-storage";
import { NavbarLayout } from "../layout";
import Nav from "../task/component/nav";
import WorkSpaceLayout from "./layout/workspace-layout";
import ProjectsPage from "./pages/projects";
import TeamPage from "./pages/team";
import WorkspacePageView from "./workspace.page";

function WorkSpacePage() {
  const [orgs, setOrgs] = useState([]);
  const [projects, setProjects] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { organizationService } = useAppService();
  const [user, setUser] = useLocalStorage("user");
  const [active, setActive] = useState(false);

  const params = useParams();
  // Current organization id
  const id = params.id;

  const { projectService } = useAppService();
  const navigation = useNavigate();

  useEffect(() => {
    if (!user) return;
    console.log("Getting orgs");
    setIsLoading(true);
    organizationService
      .getAllOrganizations()
      .then(({ companies }) => {
        if (companies.length == 0) {
          navigation(AppRoutes.onboard.step1);
        } else {
          setOrgs(companies);
        }
      })
      .catch((err) => {
        console.log(err);

        toast.error("Failed to load organizations");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [user]);

  // Get projects for current organization
  useEffect(() => {
    if (!id || !user) {
      return;
    }
    console.log("Getting projects", id);
    setIsLoading(true);
    projectService
      .getAllProjects(id)
      .then(({ Projects }) => {
        console.log("projects", Projects);
        if (projects.length != 0) {
          setProjects(Projects);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, user]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          Loading...
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <NavbarLayout>
            <div className="flex items-center gap-5 w-full">
              <button
                onClick={() => {
                  setActive(true);
                }}
              >
                <FIcon icon={solid("bars")} className="text-slate-500" />
              </button>
              <Nav />
            </div>
          </NavbarLayout>
          <WorkspaceSidePanel active={active} setActive={setActive} />
          <Fold
            value={projects}
            ifPresent={(list) => <>Project details</>}
            ifAbsent={(list) => <EmptyProjectsView />}
          />
        </div>
      )}
    </>
  );

  function EmptyProjectsView() {
    return (
      <div className="flex-1">
        <div className="h-full flex flex-col gap-4 w-full items-center place-content-center max-w-xl mx-auto text-center">
          <h1 className="text-3xl">Create a project</h1>
          <span className="text-slate-500 text-sm">
            Projects are where you
            <span className="font-medium mx-2 text-slate-700">
              organize your work.
            </span>
            You can create projects for different teams, clients, or even for
            yourself. For example, an{" "}
            <span className="font-medium mx-2 text-slate-700">engineering</span>
            project could contains all engineering-related tasks.
          </span>
          <div className="border rounded-full border-teal-400">
            <Button
              label="Create Project"
              type="outline"
              className="rounded-full"
              size="small"
            />
          </div>
        </div>
      </div>
    );
  }
}

function WorkspaceSidePanel({ setActive, active, projects }) {
  const navigation = useNavigation();

  return (
    <SlideModal
      width="320px"
      setActive={setActive}
      active={active}
      align="left"
    >
      <div className="Layout bg-white w-full h-full">
        {/* Workspace Settings and Toggle */}
        <div className="flex justify-between items-center p-4">
          <CustomDropDown
            button={
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 flex-1">
                <span>My Awesome Workspace</span>
                <FIcon icon={solid("angle-down")} />
              </div>
            }
          >
            <div className="relative">
              <div className="absolute -right-20 flex flex-col p-2 gap-[2px] rounded bg-white text-sm shadow-lg border">
                <p className="text-slate-400 py-2 w-64 ">
                  My Awesome Workspace
                </p>
                <div className="flex flex-col gap-1">
                  <div className="px-2 py-3 rounded hover:bg-gray-100 cursor-pointer">
                    Team Settings
                  </div>
                  <div
                    className="px-2 py-3 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigation(AppRoutes.users.myOrganization);
                    }}
                  >
                    Switch and manage workspaces
                  </div>
                </div>
              </div>
            </div>
          </CustomDropDown>

          {/* Close this panel */}
          <button onClick={() => setActive(false)}>
            <FIcon icon={solid("angles-left")} className="text-slate-500" />
          </button>
        </div>

        {/* CREATE PROJECT */}

        <div className="flex gap-2 px-3 items-center mt-3">
          <p className="flex-1 text-[13px] text-slate-400">PROJECTS</p>
          <Button
            label="create Project"
            type="link"
            size="small"
            leadingIcon={
              <FIcon icon={solid("plus")} className="text-teal-500" />
            }
          />
        </div>

        <Fold
          value={projects}
          ifPresent={(list) => (
            <ListView
              items={list}
              renderItem={(project) => (
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <FIcon icon={solid("folder")} className="text-slate-500" />
                  <p className="text-sm font-medium text-gray-900">
                    {project.name}
                  </p>
                </div>
              )}
              noItemsElement={
                <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <FIcon icon={solid("folder")} className="text-slate-500" />
                  <p className="text-sm font-medium text-gray-900">
                    Create a workspace to get started
                  </p>
                </div>
              }
            />
          )}
          ifAbsent={() => (
            <div className="px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 ">
              <span className="text-sm text-slate-600">
                Create a workspace to get started
              </span>
            </div>
          )}
        />
      </div>
    </SlideModal>
  );
}

export default WorkSpacePage;
