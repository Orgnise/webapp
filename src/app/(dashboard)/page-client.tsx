"use client";

import { CreateTeam } from "@/components/team/create/create-team";
import TeamsList from "@/components/team/team-list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomTooltipContent, ToolTipWrapper } from "@/components/ui/tooltip";
import { FREE_TEAMS_LIMIT } from "@/lib/constants/pricing";

import useTeams from "@/lib/swr/use-teams";
import { Fold } from "@/lib/utils";

interface CerateWorkspaceModelProps {
  children: React.ReactNode;
}

export default function DashboardClient() {
  const { exceedingFreeTeam } = useTeams();
  return (
    <div className="">
      <div className="flex h-36 items-center border-b border-border bg-background">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-2xl ">My Teams</h1>
            <Fold
              value={!exceedingFreeTeam}
              ifPresent={(value: unknown) => (
                <CerateWorkspaceModel>
                  <Button size={"sm"} variant={"default"}>
                    Create Team
                  </Button>
                </CerateWorkspaceModel>
              )}
              ifAbsent={() => (
                <ToolTipWrapper
                  content={
                    <CustomTooltipContent
                      title={`You can only create up to ${FREE_TEAMS_LIMIT} free teams. Additional team require a paid plan.`}
                      cta="Upgrade to Pro"
                      href={"#"}
                    />
                  }
                >
                  <Button size={"sm"} variant={"subtle"}>
                    Create Team
                  </Button>
                </ToolTipWrapper>
              )}
            />
          </div>
        </div>
      </div>
      <TeamsList />
    </div>
  );
}

export function CerateWorkspaceModel({ children }: CerateWorkspaceModelProps) {
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" rounded-lg border-border bg-card p-0">
        <CreateTeam />
        <DialogClose id="CreateTeamCloseDialogButton" className="hidden">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
