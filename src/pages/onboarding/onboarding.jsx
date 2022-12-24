import React, { useEffect, useState } from "react";
import { LoaderIcon, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SocketEvent } from "../../constant/socket-event-constant";
import { AppRoutes } from "../../helper/app-routes";
import Validator from "../../helper/validator";
import { useAppService } from "../../hooks/use-app-service";
import useAuth from "../../hooks/use-auth";
import useSocket from "../../hooks/use-socket.hook";

function OnboardingPage() {
  const navigate = useNavigate();
  const { teamService } = useAppService();
  const { user } = useAuth();

  const socket = useSocket([SocketEvent.team.create], (event, data) => {
    if (event === SocketEvent.team.create) {
      navigate(`/onboard/${data.id}/onboarding-workspaces`);
    }
    console.log("🚀 ~data", data);
  });

  // Get user initial data
  useEffect(() => {
    if (!Validator.hasValue(user)) return;
    teamService
      .getAllTeams()
      .then(({ teams }) => {
        // If user has no team, redirect to onboarding page
        if (!Validator.hasValue(teams)) {
          console.log("🚀 ~ Navigate to create team");
          navigate(AppRoutes.team.create);
        } else {
          console.log("🚀 ~ Navigate to my team");
          navigate(AppRoutes.users.myTeam);
        }
      })
      .catch(({ response }) => {
        toast.error(response.data.message);
      })
      .finally(() => {});
  }, [user]);

  return (
    <div className="w-full h-full bg-slate-50">
      <div className="max-w-xl mx-auto py-24 px-3">
        <div className="flex flex-col space-y-3 items-center place-content-center text-sm">
          <LoaderIcon />
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
