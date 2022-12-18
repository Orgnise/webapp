import React, { useState, useEffect } from "react";
import cx from "classnames";
import AddOrganization from "./component/add-organization";
import { Link, useNavigate } from "react-router-dom";
import { NavbarLayout } from "../../layout";
import Nav from "../../task/component/nav";
import { Fold } from "../../../helper/typescript-utils";
import { AppRoutes } from "../../../helper/app-routes";
import useSocket from "../../../hooks/use-socket.hook";
import { SocketEvent } from "../../../constant/socket-event-constant";

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const socket = useSocket([SocketEvent.organization.create], (event, data) => {
    if (event === SocketEvent.organization.create) {
      navigate(`/onboard/${data.meta.slug}`);
    }
    console.log("🚀 ~data", data);
  });
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="flex-1 flex items-center bg-gray-50">
        <div className="max-w-xl mx-auto py-24 px-3">
          <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
            <CreateOrganization />
          </div>
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
