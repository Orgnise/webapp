"use client";

import Tab from "@/components/atom/tab";
import TeamPermissionView from "@/components/molecule/team-permisson-view";
import WorkspaceMembers from "@/components/team/workspace/settings/workspace-members";
import { Button } from "@/components/ui/button";
import { useAddWorkspaceModal } from "@/components/ui/models";
import { useState } from "react";

const tabs: Array<"Members"> = ["Members"];

export default function ProjectPeopleClient() {
  const [currentTab, setCurrentTab] = useState<"Members">("Members");
  const { AddWorkspaceMembersModal, setShowAddWorkspaceMembersModal } =
    useAddWorkspaceModal();
  return (
    <>
      <AddWorkspaceMembersModal />
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-medium">People</h2>
            <p className="text-sm text-muted-foreground">
              Teammates that have access to this workspace.
            </p>
          </div>
          <TeamPermissionView permission="INVITE_MANAGE_REMOVE_TEAM_MEMBER">
            <Button
              className="h-9"
              onClick={() => setShowAddWorkspaceMembersModal(true)}
            >
              Add Members
            </Button>
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
        <WorkspaceMembers />
      </div>
    </>
  );
}
