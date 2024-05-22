"use client";

import Tab from "@/components/atom/tab";
import TeamPermissionView from "@/components/molecule/team-permisson-view";
import InviteViaEmail from "@/components/team/invite/invite-via-email";
import InviteViaLink from "@/components/team/invite/invite-via-link";
import InvitedMembers from "@/components/team/invite/invites-team-members";
import TeamMembers from "@/components/team/invite/team-members";
import { CustomTooltipContent, ToolTipWrapper } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getNextPlan } from "@/lib/constants";
import useUsage from "@/lib/hooks/use-usage";
import useTeam from "@/lib/swr/use-team";
import { Team } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import { LinkIcon, MailIcon } from "lucide-react";
import { useState } from "react";

const tabs: Array<"Members" | "Invitations"> = ["Members", "Invitations"];

export default function ProjectPeopleClient() {
  const [currentTab, setCurrentTab] = useState<"Members" | "Invitations">(
    "Members",
  );

  const { activeTeam, plan, meta } = useTeam();
  const { exceedingMembersLimit, limit, usage } = useUsage();

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-medium">People</h2>
            <p className="text-sm text-muted-foreground">
              Teammates that have access to this team.
            </p>
          </div>

          <TeamPermissionView permission="INVITE_MANAGE_REMOVE_TEAM_MEMBER">
            <Fold
              value={!exceedingMembersLimit}
              ifPresent={(value: unknown) => (
                <CopyInviteToTeamLinkCodeModel team={activeTeam}>
                  <Button className="h-9">Invite</Button>
                </CopyInviteToTeamLinkCodeModel>
              )}
              ifAbsent={() => (
                <ToolTipWrapper
                  content={
                    <CustomTooltipContent
                      title={`Current plan can have upto ${limit?.users} members in team. Additional members require ${getNextPlan(plan)?.name} plan.`}
                      cta={`Upgrade to ${getNextPlan(plan)?.name}`}
                      href={`/${meta?.slug}/settings/billing?upgrade=pro`}
                    />
                  }
                >
                  <Button size={"sm"} variant={"subtle"}>
                    Invite
                  </Button>
                </ToolTipWrapper>
              )}
            />
          </TeamPermissionView>
        </div>
        <div className="flex space-x-3 border-b border-border px-3 sm:px-7">
          {tabs.map((tab, index) => (
            <TeamPermissionView
              permission="INVITE_MANAGE_REMOVE_TEAM_MEMBER"
              key={index}
            >
              <Tab
                key={index}
                tab={tab}
                selected={tab === currentTab}
                onClick={() => setCurrentTab(tab)}
              />
            </TeamPermissionView>
          ))}
        </div>
        {currentTab === "Members" ? <TeamMembers /> : <InvitedMembers />}
      </div>
    </>
  );
}

function CopyInviteToTeamLinkCodeModel({
  children,
  team,
}: {
  children: React.ReactNode;
  team?: Team;
}) {
  const [inviteVia, setInviteVia] = useState<"link" | "email">("link");
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" w-fit max-w-md gap-0 overflow-hidden rounded-lg border-border bg-card p-0">
        <Fold
          value={inviteVia === "email"}
          ifPresent={(value: any) => <InviteViaLink team={team} />}
          ifAbsent={() => <InviteViaEmail team={team} />}
        />
        <div
          className="flex cursor-pointer flex-row items-center gap-1 bg-accent px-7 pb-7  text-sm"
          onClick={() => setInviteVia(inviteVia === "email" ? "link" : "email")}
        >
          {inviteVia === "link" ? (
            <LinkIcon size={15} />
          ) : (
            <MailIcon size={15} />
          )}
          <span>Or, invite via {inviteVia}</span>
        </div>
        <DialogClose id="InviteTeamCloseDialogButton" className="hidden">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
