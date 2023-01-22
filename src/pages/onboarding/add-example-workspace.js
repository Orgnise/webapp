import React, { useState, useEffect } from "react";
import { LoaderIcon, toast } from "react-hot-toast";
import cx from "classnames";
import { SocketEvent } from "../../constant/socket-event-constant";
import useSocket from "../../hooks/use-socket.hook";
import { NavbarLayout } from "../layout";
import Nav from "../task/component/nav";
import { useNavigate, useParams } from "react-router-dom";
import { AppRoutes } from "../../helper/app-routes";
import { useAppService } from "../../hooks/use-app-service";
import CheckBox from "../../components/atom/checkbox";
import Button from "../../components/atom/button";
import Label from "../../components/typography";

export default function AddExampleWorkspacePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="max-w-xl mx-auto py-24">
        <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
          <AddExampleSpace />
        </div>
      </div>
    </div>
  );
}
function AddExampleSpace() {
  const [isLoading, setIsLoading] = useState();
  const params = useParams();
  const slug = params.slug;

  const [workspaces, setWorkspace] = useState({});
  const { workspaceService } = useAppService();
  const navigate = useNavigate();

  // Toggle example workspace selection
  const selectWorkspace = (workspace, val) => {
    if (val === false) {
      const { [workspace]: _, ...rest } = workspaces;
      setWorkspace(rest);
    } else {
      setWorkspace({ ...workspaces, [workspace]: val });
    }
  };

  // Add example workspaces
  const createWorkspace = () => {
    setIsLoading(true);
    const examples = Object.keys(workspaces).map((key) => key);

    const payload = {
      examples,
    };

    workspaceService
      .addExampleWorkspaceBySlug(slug, payload)
      .then(({ workspaces }) => {
        toast.success("Examples workspaces added successfully", {
          position: "top-right",
        });
        // Navigate to workspace page after 1 second delay
        // TODO: Open workspace navigation
        navigate(`/team/${slug}`);
      })
      .catch(({ response }) => {
        console.log(
          "🚀 ~ file: onboarding.jsx:120 ~ .catch ~ error",
          response.data
        );
        toast.error(response.data.error, { position: "top-right" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-card shadow rounded-md px-4 py-2 w-96">
      <div className="flex flex-col gap-2 py-6  px-4">
        <Label size="h2" variant="t2">
          Add examples
        </Label>

        <p>Select any example you&apos;d like to add to your team</p>
        <div className="flex flex-col gap-6 py-4 select-none">
          <CheckBox
            label="Engineering"
            checked={workspaces.Engineering}
            onChange={(val) => {
              selectWorkspace("Engineering", val);
            }}
          />
          <CheckBox
            label="Game Development"
            checked={workspaces["Game Development"]}
            onChange={(val) => {
              selectWorkspace("Game Development", val);
            }}
          />
          <CheckBox
            label="Product Management"
            checked={workspaces["Product Management"]}
            onChange={(val) => {
              selectWorkspace("Product Management", val);
            }}
          />
          <CheckBox
            label="Marketing"
            checked={workspaces.Marketing}
            onChange={(val) => {
              selectWorkspace("Marketing", val);
            }}
          />
          <CheckBox
            label="Sales"
            checked={workspaces.Sales}
            onChange={(val) => {
              selectWorkspace("Sales", val);
            }}
          />
          <CheckBox
            label="Design"
            checked={workspaces.Design}
            onChange={(val) => {
              selectWorkspace("Design", val);
            }}
          />
        </div>

        <div className="flex w-full">
          <Button
            label={Object.keys(workspaces).length === 0 ? "Skip" : "Continue"}
            className="flex-1"
            // disabled={Object.keys(workspaces).length === 0 || isLoading}
            onClick={createWorkspace}
            leadingIcon={isLoading ? <LoaderIcon /> : null}
          />
        </div>
      </div>
    </div>
  );
}
