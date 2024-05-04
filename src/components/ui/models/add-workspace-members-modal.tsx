import { Modal } from "@/components/ui/model";
import useUsers from "@/lib/swr/use-users";
import useWorkspaceUsers, {
  AddWorkspaceMemberProp,
} from "@/lib/swr/use-workspace-users";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Avatar } from "../avatar";
import { Button2 } from "../button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { WorkspaceRole } from "@/lib/constants/workspace-role";
import { TeamMemberProps } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import { MinusCircleIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

import useWorkspaces from "@/lib/swr/use-workspaces";
import clsx from "clsx";

interface SelectUser {
  user: TeamMemberProps;
  role: WorkspaceRole;
}

function AddWorkspaceMembersModal({
  showAddWorkspaceMembersModal,
  setShowAddWorkspaceMembersModal,
}: {
  showAddWorkspaceMembersModal: boolean;
  setShowAddWorkspaceMembersModal: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    users: teamUsers,
    loading: teamLoading,
    error: teamError,
  } = useUsers();
  const {
    users: workspaceUsers,
    loading: workspaceLoading,
    error: workspaceError,
    addMembers,
  } = useWorkspaceUsers();

  const { activeWorkspace } = useWorkspaces();

  const [selectedUsers, setSelectedUsers] = useState<SelectUser[]>([]);
  const [unJoinedMembers, setUnJoinedMembers] = useState<TeamMemberProps[]>([]);

  useEffect(() => {
    if (teamLoading || workspaceLoading) return;
    if (teamUsers && workspaceUsers)
      setUnJoinedMembers(
        teamUsers?.filter(
          (teamUser) =>
            !workspaceUsers.some(
              (workspaceUser) => workspaceUser.email === teamUser.email,
            ),
        ) ?? [],
      );
  }, [teamLoading, workspaceLoading, teamUsers, workspaceUsers]);

  async function AddMembers() {
    if (selectedUsers.length === 0) return;
    const map = selectedUsers.map((selected) => ({
      email: selected.user.email,
      role: selected.role,
    })) as AddWorkspaceMemberProp[];
    console.table(map);
    await addMembers(map).then(() => {
      setShowAddWorkspaceMembersModal(false);
    });
  }

  return (
    <Modal
      showModal={showAddWorkspaceMembersModal}
      setShowModal={setShowAddWorkspaceMembersModal}
      className="w-full max-w-[602px]"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
        <h3 className="text-lg font-medium">Add Workspace Members</h3>
        <p className="text-center text-sm text-muted-foreground/90">
          Add members to your workspace to collaborate
        </p>
      </div>
      {teamLoading || workspaceLoading ? (
        <UsersPlaceholders />
      ) : teamError || workspaceError ? (
        <p className="text-muted-foreground">
          Error loading users. Please try again.
        </p>
      ) : selectedUsers.length == 0 && unJoinedMembers.length == 0 ? (
        <div className="flex h-40 flex-col place-content-center bg-accent/30 text-center text-sm text-muted-foreground">
          All team members have been added to the workspace.
        </div>
      ) : (
        <div className="flex flex-col">
          {/* Team Members */}
          <div
            className={clsx("flex flex-col gap-4 px-4 ", {
              "py-6": unJoinedMembers.length !== 0,
            })}
          >
            <div
              className={clsx(
                "grid max-h-[60vh] grid-cols-1 gap-2 overflow-auto",
                {
                  hidden: unJoinedMembers.length === 0,
                },
              )}
            >
              <SearchUserBox
                users={unJoinedMembers}
                onUserSelect={(user) => {
                  setSelectedUsers([
                    {
                      user: user,
                      role:
                        activeWorkspace?.defaultAccess == "full"
                          ? "editor"
                          : "reader",
                    },
                    ...selectedUsers,
                  ]);
                  setUnJoinedMembers(
                    unJoinedMembers.filter(
                      (unJoinedMember) => unJoinedMember.email !== user.email,
                    ),
                  );
                }}
              />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <div className="text-sm text-muted-foreground">
                Selected Members
              </div>

              <div className="flex max-h-[300px] flex-col gap-3 overflow-auto overflow-x-hidden">
                <Fold
                  value={selectedUsers}
                  ifPresent={(a: any) => (
                    <>
                      {selectedUsers.map((selected, index) => {
                        const isMember = workspaceUsers.some(
                          (workspaceUser) =>
                            workspaceUser.email === selected.user.email,
                        );
                        return (
                          <div
                            key={index}
                            className="flex w-full  items-center justify-between rounded-lg  border border-border px-2 py-2 "
                          >
                            <div className="flex items-center space-x-3 ">
                              <Avatar user={selected.user} />
                              <div className="flex flex-col">
                                <h3 className="text-sm font-medium">
                                  {selected.user.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {selected.user.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-row items-center space-x-1">
                              <SelectAccessLevel
                                defaultRole={
                                  activeWorkspace?.defaultAccess == "full"
                                    ? "editor"
                                    : "reader"
                                }
                                onValueChange={(val: WorkspaceRole) => {
                                  setSelectedUsers(
                                    selectedUsers.map((selectedUser) =>
                                      selectedUser.user.email ===
                                      selected.user.email
                                        ? { ...selectedUser, role: val }
                                        : selectedUser,
                                    ),
                                  );
                                }}
                              />
                              <button
                                className="group flex h-8 w-8 place-content-center items-center rounded-full text-center "
                                onClick={() => {
                                  const unSelected = [
                                    ...unJoinedMembers,
                                    { ...selected.user },
                                  ];

                                  const selectedList = selectedUsers.filter(
                                    (s) => s.user.email !== selected.user.email,
                                  );
                                  setSelectedUsers(selectedList);
                                  setUnJoinedMembers(unSelected);
                                }}
                              >
                                <MinusCircleIcon
                                  className=" rounded-full bg-destructive text-destructive-foreground transition-transform duration-150 ease-in-out group-hover:scale-95"
                                  size={20}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                  ifAbsent={() => (
                    <div className="rounded border border-border p-6 text-center text-sm text-muted-foreground">
                      No members added yet. Click on the search bar above to add
                      members.
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-accent/30 px-4 py-6">
            <div className="flex w-full flex-row place-content-end items-center gap-4">
              <Button2
                text="Cancel"
                variant="outline"
                onClick={() => setShowAddWorkspaceMembersModal(false)}
              />
              <Button2
                text="Add members"
                variant="default"
                onClick={async () => AddMembers()}
              />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
function SelectAccessLevel({
  defaultRole = "editor",
  onValueChange,
}: {
  defaultRole: WorkspaceRole;
  onValueChange: (val: WorkspaceRole) => void;
}) {
  return (
    <Select defaultValue={defaultRole} onValueChange={onValueChange}>
      <SelectTrigger className="w-[140px] gap-1  px-2 ">
        <SelectValue
          placeholder={defaultRole === "editor" ? "Editor" : "Reader"}
        />
      </SelectTrigger>
      <SelectContent className="border-border">
        <SelectItem value={"editor"}>Editor</SelectItem>
        <SelectItem value="reader">Reader</SelectItem>
      </SelectContent>
    </Select>
  );
}

function UsersPlaceholders() {
  return (
    <div>
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      </div>
      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
    </div>
  );
}

interface SearchUserBox {
  users: TeamMemberProps[];
  onUserSelect: (user: TeamMemberProps) => void;
}
export function SearchUserBox({ users, onUserSelect }: SearchUserBox) {
  if (users.length === 0) {
    return null;
  } else if (users.length < 5) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-sm text-muted-foreground ">Team members</h3>
        {users.map((user, index) => (
          <div
            key={index}
            className="flex cursor-pointer items-center space-x-3 rounded-lg px-2 py-2 hover:bg-accent/70"
            onClick={() => onUserSelect(user)}
          >
            <Avatar user={user} />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{user.name}</h3>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        ))}
        <hr className="mt-3" />
      </div>
    );
  }

  return (
    <Command className="rounded-lg border border-border">
      <CommandInput placeholder="Search" className="border-border" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Team Members">
          {users.map((user, index) => (
            <CommandItem
              className="cursor-pointer  space-x-3"
              key={index}
              value={user.name}
              onSelect={(v) => {
                onUserSelect(user);
              }}
            >
              <Avatar user={user} />
              <div className="flex flex-col">
                <h3 className="text-sm font-medium">{user.name}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export function useAddWorkspaceModal() {
  const [showAddWorkspaceMembersModal, setShowAddWorkspaceMembersModal] =
    useState(false);

  const AddWorkspaceModalCallback = useCallback(() => {
    return (
      <AddWorkspaceMembersModal
        showAddWorkspaceMembersModal={showAddWorkspaceMembersModal}
        setShowAddWorkspaceMembersModal={setShowAddWorkspaceMembersModal}
      />
    );
  }, [showAddWorkspaceMembersModal]);

  return useMemo(
    () => ({
      setShowAddWorkspaceMembersModal,
      AddWorkspaceMembersModal: AddWorkspaceModalCallback,
    }),
    [setShowAddWorkspaceMembersModal, AddWorkspaceModalCallback],
  );
}
