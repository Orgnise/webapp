import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { useEffect, useState } from "react";
import { LoaderIcon, toast } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/atom/button";
import CheckBox from "../../components/atom/checkbox";
import Logo from "../../components/atom/logo";
import FIcon from "../../components/ficon";
import ModalForm from "../../components/modal";
import { SocketEvent } from "../../constant/socket-event-constant";
import { AppRoutes } from "../../helper/app-routes";
import { Fold } from "../../helper/typescript-utils";
import { useAppService } from "../../hooks/use-app-service";
import useSocket from "../../hooks/use-socket.hook";
import { NavbarLayout } from "../layout";
import AddOrganization from "../organization/component/add-organization";
import Nav from "../task/component/nav";

function OnboardingPage() {
  const [organization, setOrganization] = useState();
  const navigate = useNavigate();
  const socket = useSocket([SocketEvent.organization.create], (event, data) => {
    if (event === SocketEvent.organization.create) {
      navigate(`/onboard/${data.id}/onboarding-projects`);
    }
    console.log("🚀 ~data", data);
  });

  return (
    <div className="w-full h-full bg-slate-50">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="max-w-xl mx-auto py-24 px-3">
        <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
          <Fold
            value={organization}
            ifPresent={() => <>Display Project list</>}
            ifAbsent={() => <CreateOrganization />}
          />
        </div>
      </div>
    </div>
  );
}

function CreateOrganization() {
  const [isVisible, setIsVisible] = useState();

  return (
    <div className="flex flex-col gap-6 py-6 items-center bg-white shadow w-full  rounded-md max-w-[500px]">
      <p className="font-bold text-xl font-sans">Create your Organizations</p>
      <div className="flex flex-col w-full px-4 max-w-[400px] ">
        <AddOrganization setVisible={setIsVisible} />
        <span className="p-6">
          <span className="text-slate-500">
            Looking to join an existing team? Ask someone of that team to invite
            you and
          </span>
          <span className="pl-2 text-primary">
            <Link
              to={AppRoutes.users.myOrganization}
              className="text-emerald-500"
            >
              check your team
            </Link>
          </span>
        </span>
      </div>
    </div>
  );
}

export function OnboardingStepPage() {
  const [project, setProject] = useState();
  const projectCreate = SocketEvent.organization.project.create;
  const socket = useSocket([projectCreate], (event, data) => {
    if (event === projectCreate) {
      setProject(data);
    }
  });

  return (
    <div className="w-full h-full bg-slate-50">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="max-w-xl mx-auto py-24">
        <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
          <Fold
            value={project}
            ifPresent={() => <>Display Board list</>}
            ifAbsent={() => <AddExampleProjects />}
          />
        </div>
      </div>
    </div>
  );
}
function AddExampleProjects() {
  const [isLoading, setIsLoading] = useState();
  const params = useParams();
  const id = params.id;

  const [projects, setProjects] = useState({});
  const { projectService } = useAppService();
  const navigate = useNavigate();

  // Toggle example project selection
  const selectProject = (project, val) => {
    if (val === false) {
      const { [project]: _, ...rest } = projects;
      setProjects(rest);
    } else {
      setProjects({ ...projects, [project]: val });
    }
  };

  // Add example projects
  const createProject = () => {
    setIsLoading(true);
    const examples = Object.keys(projects).map((key) => key);

    const payload = {
      examples: examples,
    };

    projectService
      .addExampleProjects(id, payload)
      .then(({ projects }) => {
        toast.success("Examples projects added successfully", {
          position: "top-right",
        });
        // Navigate to project page after 1 second delay
        navigate(`/workspace/${id}`);
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
    <div className="bg-white shadow rounded-md px-4 py-2 w-96">
      <div className="flex flex-col gap-2 py-6  px-4">
        <h2 className="font-medium text-2xl">Add examples</h2>

        <p className="">
          Select any example you'd like to add to your organization
        </p>
        <div className="flex flex-col gap-6 py-4">
          <CheckBox
            label="Engineering"
            checked={projects.Engineering}
            onChange={(val) => {
              selectProject("Engineering", val);
            }}
          />
          <CheckBox
            label="Game Development"
            checked={projects["Game Development"]}
            onChange={(val) => {
              selectProject("Game Development", val);
            }}
          />
          <CheckBox
            label="Product Management"
            checked={projects["Product Management"]}
            onChange={(val) => {
              selectProject("Product Management", val);
            }}
          />
          <CheckBox
            label="Marketing"
            checked={projects.Marketing}
            onChange={(val) => {
              selectProject("Marketing", val);
            }}
          />
          <CheckBox
            label="Sales"
            checked={projects.Sales}
            onChange={(val) => {
              selectProject("Sales", val);
            }}
          />
          <CheckBox
            label="Design"
            checked={projects.Design}
            onChange={(val) => {
              selectProject("Design", val);
            }}
          />
        </div>

        <div className="flex w-full">
          <Button
            label="Continue"
            size="small"
            className="flex-1"
            disabled={Object.keys(projects).length === 0 || isLoading}
            onClick={createProject}
            leadingIcon={isLoading ? <LoaderIcon /> : null}
          />
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
