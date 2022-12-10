import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FIcon from "../../components/ficon";
import ModalForm from "../../components/modal";
import { SocketEvent } from "../../constant/socket-event-constant";
import { AppRoutes } from "../../helper/app-routes";
import { Fold } from "../../helper/typescript-utils";
import useSocket from "../../hooks/use-socket.hook";
import AddOrganization from "../organization/component/add-organization";
import ProjectsPage from "../workspace/pages/projects";
import AddProject from "../workspace/pages/projects/create-project";
function OnboardingPage() {
  const [organization, setOrganization] = useState();
  const navigate = useNavigate();
  const socket = useSocket([SocketEvent.organization.create], (event, data) => {
    if (event === SocketEvent.organization.create) {
      navigate(`/onboard/${data.id}/step1`);
    }
    console.log("🚀 ~data", data);
  });

  return (
    <div className="w-full h-full bg-slate-50">
      <div className="max-w-xl mx-auto h-full py-24">
        <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
          <h3 className="font-bold text-lg">Your Organizations</h3>
          <Fold
            value={organization}
            ifPresent={() => <>Display Project list</>}
            ifAbsent={() => <NoOrgView />}
          />
        </div>
      </div>
    </div>
  );
}

function NoOrgView() {
  const [isVisible, setIsVisible] = useState();

  return (
    <div className="flex flex-col space-y-3 items-center place-content-center text-sm w-full">
      <div className="flex flex-col place-content-center items-center space-y-2 divide-y bg-white shadow rounded-md px-4 py-2 w-4/5  ">
        <p className="">You don't have any organization</p>

        <div
          className="flex items-center text-start  w-full hover:bg-gray-100 cursor-pointer p-2 rounded select-none"
          onClick={() => {
            setIsVisible(true);
          }}
        >
          <FIcon icon={solid("add")} className="mr-2" />
          <p>Create new</p>
        </div>
      </div>
      <ModalForm
        title="Create organization"
        visible={isVisible}
        setVisible={setIsVisible}
        button={<></>}
      >
        <AddOrganization setVisible={setIsVisible} />
      </ModalForm>
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
      <div className="max-w-xl mx-auto h-full py-24">
        <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
          <h3 className="font-bold text-lg">Your Projects</h3>
          <Fold
            value={project}
            ifPresent={() => <>Display Board list</>}
            ifAbsent={() => <NoProjView />}
          />
        </div>
      </div>
    </div>
  );
}
function NoProjView() {
  const [isVisible, setIsVisible] = useState();
  const params = useParams();
  const id = params.id;
  console.log("🚀 ~ file: onboarding.jsx:97 ~ NoProjView ~ id", id);

  return (
    <div className="flex flex-col space-y-3 items-center place-content-center text-sm w-full">
      <div className="flex flex-col place-content-center items-center space-y-2 divide-y bg-white shadow rounded-md px-4 py-2 w-4/5  ">
        <p className="">You don't have any project</p>

        <div
          className="flex items-center text-start  w-full hover:bg-gray-100 cursor-pointer p-2 rounded select-none"
          onClick={() => {
            setIsVisible(true);
          }}
        >
          <FIcon icon={solid("add")} className="mr-2" />
          <p>Create new</p>
        </div>
        <ProjectsPage />
      </div>
      <ModalForm
        title="Create Project"
        visible={isVisible}
        setVisible={setIsVisible}
        button={<></>}
      >
        <AddProject setVisible={setIsVisible} orgId={id} />
      </ModalForm>
    </div>
  );
}

export default OnboardingPage;
