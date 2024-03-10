"use client";

import { Logo } from "@/components/atom/logo";
import Tab from "@/components/atom/tab";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { APP_DOMAIN } from "@/lib/constants";
import useTeams from "@/lib/swr/use-teams";
import useUsers from "@/lib/swr/use-users";
import { UserProps } from "@/lib/types/types";
import { timeAgo } from "@/lib/utility/datetime";
import { cn } from "@/lib/utils";
import { LinkIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

const tabs: Array<"Members" | "Invitations"> = ["Members", "Invitations"];

export default function ProjectPeopleClient() {
  const [currentTab, setCurrentTab] = useState<"Members" | "Invitations">(
    "Members",
  );
  // const users = [] as any;
  const { users } = useUsers({ invites: currentTab === "Invitations" });
  const { activeTeam } = useTeams();
  const { data: session } = useSession();
  const authUser = session?.user;

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col items-center justify-between space-y-3 p-5 sm:flex-row sm:space-y-0 sm:p-10">
          <div className="flex flex-col space-y-3">
            <h2 className="text-xl font-medium">People</h2>
            <p className="text-sm text-muted-foreground">
              Teammates that have access to this project.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button className="h-9">Invite</Button>
            <InviteToTeamCodeModel
              inviteCode={activeTeam?.inviteCode ?? "none"}
            >
              <Button variant="secondary" className="h-9" size={"icon"}>
                <LinkIcon className="h-4 w-4" />
              </Button>
            </InviteToTeamCodeModel>
          </div>
        </div>
        <div className="flex space-x-3 border-b border-border px-3 sm:px-7">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              tab={tab}
              selected={tab === currentTab}
              onClick={() => setCurrentTab(tab)}
            />
          ))}
        </div>
        <div className="grid divide-y divide-border">
          {users ? (
            users.length > 0 ? (
              users.map((user: any) => (
                <UserCard
                  key={user.email}
                  user={user}
                  currentTab={currentTab}
                  isOwner={
                    users.find((u: UserProps) => u.role === "owner")?.email ===
                    authUser?.email
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                {/* TODO: Display placeholder image */}
                <p className="text-sm text-muted-foreground">
                  No invitations sent
                </p>
              </div>
            )
          ) : (
            Array.from({ length: 5 }).map((_, i) => <UserPlaceholder key={i} />)
          )}
        </div>
      </div>
    </>
  );
}

const UserCard = ({
  user,
  currentTab,
  isOwner,
}: {
  user: UserProps;
  currentTab: "Members" | "Invitations";
  isOwner: boolean;
}) => {
  const [openPopover, setOpenPopover] = useState(false);

  const { name, email, createdAt, role: currentRole } = user;

  const [role, setRole] = useState<"owner" | "member">(currentRole);

  const { data: session } = useSession();

  // invites expire after 14 days of being sent
  const expiredInvite =
    currentTab === "Invitations" &&
    createdAt &&
    Date.now() - new Date(createdAt).getTime() > 14 * 24 * 60 * 60 * 1000;

  return (
    <>
      <div
        key={email}
        className="flex items-center justify-between space-x-3 px-4 py-3 sm:pl-8"
      >
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-3">
            <Avatar user={user} />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{name || email}</h3>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          {expiredInvite && <Badge variant="secondary">Expired</Badge>}
        </div>
        <div className="flex items-center space-x-3">
          {currentTab === "Members" ? (
            session?.user?.email === email || !isOwner ? (
              <p className="text-xs capitalize text-muted-foreground">{role}</p>
            ) : (
              <select
                className={cn(
                  "rounded-md border border-border text-xs text-muted-foreground",
                  {
                    "cursor-not-allowed bg-muted": !isOwner,
                  },
                )}
                value={role}
                disabled={!isOwner}
                onChange={(e) => {
                  setRole(e.target.value as "owner" | "member");
                  setOpenPopover(false);
                  // setShowEditRoleModal(true);
                }}
              >
                <option value="owner">Owner</option>
                <option value="user">User</option>
              </select>
            )
          ) : (
            <p
              className="text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              Invited {timeAgo(createdAt)}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

function InviteToTeamCodeModel({
  children,
  inviteCode,
}: {
  children: React.ReactNode;
  inviteCode: string;
}) {
  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" rounded-lg border-border bg-card p-0">
        {/* <CreateTeam /> */}
        <InviteTeammateModal inviteCode={inviteCode} />
        <DialogClose id="CreateTeamCloseDialogButton" className="hidden">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function InviteTeammateModal({ inviteCode }: { inviteCode: string }) {
  const inviteLink = useMemo(() => {
    return `${APP_DOMAIN}/invites/${inviteCode}`;
  }, [inviteCode]);
  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <Logo className="h-10" />
        <h3 className="text-lg font-medium">Invite Link</h3>
        <p className="text-center text-sm text-muted-foreground/90">
          Allow other people to join your Team through the link below.
        </p>
      </div>

      <div className="flex flex-col space-y-3 bg-background px-4 py-8 text-left sm:px-8">
        <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-1.5">
          <p className="scrollbar-hide w-[88%] overflow-scroll font-mono text-xs text-muted-foreground">
            {inviteLink}
          </p>
          <CopyButton value={inviteLink} className="rounded-md" />
        </div>
        {/* TODO: Add reset invite button */}
      </div>
    </div>
  );
}

const UserPlaceholder = () => (
  <div className="flex items-center justify-between space-x-3 px-4 py-3 sm:px-8">
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-col">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="mt-1 h-3 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
  </div>
);
