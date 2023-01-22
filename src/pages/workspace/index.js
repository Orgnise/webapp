import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import cx from "classnames";
import React, { useState, useEffect } from "react";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import Button from "../../components/atom/button";
import { LoadingSpinner } from "../../components/atom/spinner";
import { ListView } from "../../components/compound/list-view";
import CustomDropDown from "../../components/custom_dropdown";
import FIcon from "../../components/ficon";
import { SlideModal } from "../../components/molecule/slide-modal";
import { AppRoutes } from "../../helper/app-routes";
import { Fold, ExtractPath } from "../../helper/typescript-utils";
import Validator from "../../helper/validator";

import { useAppService } from "../../hooks/use-app-service";
import useAuth from "../../hooks/use-auth";
import useSearchPath from "../../hooks/use-search-path-hook";
import useWorkspace from "./hook/use-workspace.hook";
import { NavbarLayout } from "../layout";
import Nav from "../task/component/nav";
import WorkspaceContentView from "./layout/workspace-content-view";

import WorkspaceView from "./pages/workspace-view";
import WorkspaceSidePanel from "./layout/workspace-list-panel";
import Label from "../../components/typography";

function WorkSpacePage() {
  const [active, setActive] = useState(false);

  const { isLoadingWorkSpace, workspace, workspacesList } = useWorkspace();

  return (
    <>
      {isLoadingWorkSpace ? (
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <NavbarLayout>
            <div className="flex items-center gap-5 w-full">
              <FIcon
                icon={solid("bars")}
                className="cursor-pointer"
                onClick={() => {
                  setActive(true);
                }}
              />
              <Nav />
            </div>
          </NavbarLayout>
          <WorkspaceSidePanel active={active} setActive={setActive} />

          <Fold
            value={workspacesList}
            ifPresent={(list) => (
              <Fold
                value={workspace}
                ifPresent={(workspace) => (
                  <WorkspaceView displayWorkspace={workspace} />
                )}
                ifAbsent={() => <SuggestOpenWorkspace setActive={setActive} />}
              />
            )}
            ifAbsent={() => <EmptyWorkspaceView />}
          />
        </div>
      )}
    </>
  );

  /**
   * Display empty workspace view
   */
  function EmptyWorkspaceView() {
    const navigate = useNavigate();
    return (
      <div className="flex-1">
        <div className="h-full flex flex-col gap-4 w-full items-center place-content-center max-w-xl mx-auto text-center">
          <Label size="h1" variant="t3">
            Create a workspace
          </Label>
          <span className="text-sm">
            Workspaces are where you
            <Label variant="t2" className="mx-1 ">
              organize your work
            </Label>
            You can create workspaces for different teams, clients, or even for
            yourself. For example, an{" "}
            <Label variant="t2" className="mx-1 ">
              engineering
            </Label>
            workspace could contains all engineering-related tasks.
          </span>

          <Button
            label="Create Workspace"
            type="outline"
            className="rounded-full"
            size="small"
            onClick={() => {
              navigate("create-workspace");
            }}
          />
        </div>
      </div>
    );
  }

  /**
   * Suggest to open workspace
   */
  function SuggestOpenWorkspace({ setActive }) {
    return (
      <div className="flex-1">
        <div className="h-full flex flex-col gap-4 w-full items-center place-content-center max-w-xl mx-auto text-center">
          <Label size="h1">Open work</Label>
          <Label size="body1">
            Open a workspace to start working on your tasks.
          </Label>

          <Button
            label="Open Workspace"
            type="outline"
            className="rounded-full"
            size="small"
            onClick={() => {
              setActive(true);
            }}
          />

          <Label size="body" variant="cap">
            You can also use humburger menu to open workspace.
          </Label>
        </div>
      </div>
    );
  }
}

export default WorkSpacePage;
