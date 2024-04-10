import { IconMenu } from "@/components/atom/icon-menu";
import ThreeDots from "@/components/icons/three-dots";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ListView } from "@/components/ui/listview";
import { Popover } from "@/components/ui/popover";
import { TWO_WEEKS_IN_SECONDS } from "@/lib/constants";
import useTeamInvite from "@/lib/swr/use-team-invite";
import { UserProps } from "@/lib/types/types";
import { timeAgo } from "@/lib/utility/datetime";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { UserMinus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import RemoveTeamMemberModal from "./remove-member-model";

export default function InvitedMembers() {
  const { error, loading, users } = useTeamInvite();
  return (
    <div className="grid divide-y divide-border">
      <ListView
        items={Array.isArray(users) ? users : []}
        loading={loading}
        renderItem={(user: UserProps) => (
          <UserCard key={user.email} user={user} isOwner={false} />
        )}
        noItemsElement={
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-sm text-muted-foreground">
              No invitations sent yet.
            </p>
          </div>
        }
        placeholder={Array.from({ length: 5 }).map((_, i) => (
          <UserPlaceholder key={i} />
        ))}
      />
    </div>
  );
}

const UserCard = ({
  user,
  isOwner,
}: {
  user: UserProps;

  isOwner: boolean;
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [showRemoveTeammateModal, setShowRemoveTeammateModal] = useState(false);
  const { name, email, createdAt } = user;

  const { data: session } = useSession();

  // invites expire after 14 days of being sent
  const expiredInvite =
    createdAt &&
    Date.now() - new Date(createdAt).getTime() > TWO_WEEKS_IN_SECONDS * 1000;

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
              <p className="text-xs text-muted-foreground">
                {
                  <p
                    className="text-xs text-muted-foreground"
                    suppressHydrationWarning
                  >
                    Invited {timeAgo(createdAt, { withAgo: true })}
                  </p>
                }
              </p>
            </div>
          </div>

          {expiredInvite && <Badge variant="secondary">Expired</Badge>}
        </div>
        <div className="flex flex-row items-center gap-4">
          <Badge variant="secondary">{user.role}</Badge>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger>
              <ThreeDots className="text-secondary-foreground/70" />
            </PopoverTrigger>
            <PopoverContent className="mt-1 rounded border border-border bg-background shadow">
              <div className="grid w-full gap-1 p-2 sm:w-48">
                <button
                  onClick={() => {
                    setOpenPopover(false);
                    setShowRemoveTeammateModal(true);
                  }}
                  className="rounded-md p-2 text-left text-sm font-medium text-red-600 transition-all duration-75 hover:bg-red-600 hover:text-white"
                >
                  <IconMenu
                    text={
                      session?.user?.email === email
                        ? "Remove teammate"
                        : "Revoke invite"
                    }
                    icon={<UserMinus className="h-4 w-4" />}
                  />
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <RemoveTeamMemberModal
        showRemoveTeammateModal={showRemoveTeammateModal}
        setShowRemoveTeammateModal={setShowRemoveTeammateModal}
        user={user}
        invite={true}
      />
    </>
  );
};

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
