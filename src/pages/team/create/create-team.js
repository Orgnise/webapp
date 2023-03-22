import React, { useState, useEffect } from "react";
import cx from "classnames";
import AddTeam from "./component/add-team";
import { Link, useNavigate } from "react-router-dom";
import { NavbarLayout } from "../../layout";
import Nav from "../../task/component/nav";
import { Fold } from "../../../helper/typescript-utils";
import { AppRoutes } from "../../../helper/app-routes";
import useSocket from "../../../hooks/use-socket.hook";
import { SocketEvent } from "../../../constant/socket-event-constant";
import Label from "../../../components/typography";

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const socket = useSocket([SocketEvent.team.create], (event, data) => {
    console.log("🚀 ~ file: create-team.js:15 ~ socket ~ data", data);
    if (event === SocketEvent.team.create) {
      navigate(`/onboard/${data.meta.slug}`);
    }
    console.log("🚀 ~data", data);
  });
  return (
    <div className="w-full h-full  flex flex-col">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="flex-1 flex items-center ">
        <div className="max-w-xl mx-auto py-24 px-3">
          <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
            <CreateTeam />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateTeam() {
  const [isVisible, setIsVisible] = useState();

  return (
    <div className="flex flex-col gap-6 p-6 items-center bg-card shadow w-full  rounded-md max-w-[500px]">
      <Label size="h2" variant="t2">
        Create your Team
      </Label>
      <div className="flex flex-col w-full px-4 max-w-[400px] ">
        <AddTeam setVisible={setIsVisible} />
        <span className="p-6">
          <span>
            Looking to join an existing team? Ask someone of that team to invite
            you and
          </span>
          <span className="pl-2 text-primary">
            <Link to={AppRoutes.workspace.team} className="theme-text-primary">
              check your team
            </Link>
          </span>
        </span>
      </div>
    </div>
  );
}
