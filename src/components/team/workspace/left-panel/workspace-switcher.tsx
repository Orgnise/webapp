import Label from "@/components/atom/label";
import { ListView } from "@/components/ui/listview";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { Workspace } from "@/lib/types";
import { Fold } from "@/lib/utils";
import { clsx } from "clsx";
import { ChevronDown, Circle, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { WorkspaceSettingsDropDown } from "../workspace-settings-dropdown";
export function WorkspaceSwitcher() {
  const { workspaces, error, loading } = useWorkspaces();

  const { workspace_slug } = (useParams() as { workspace_slug?: string }) ?? {};

  if (!workspaces || loading) {
    return <></>;
  }

  const workspace =
    workspaces?.find((w) => w?.meta?.slug === workspace_slug) ??
    workspaces?.[0];

  return (
    <Sheet>
      <SheetTrigger className="flex items-center py-1">
        <button className="flex h-9 items-center gap-2 px-2">
          <span className="max-w-[190px] truncate">{workspace?.name}</span>
          <ChevronDown size={15} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="border-border p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle>Workspaces</SheetTitle>
        </SheetHeader>
        <WorkspaceListView workspaces={workspaces} />
      </SheetContent>
    </Sheet>
  );
}

export function WorkspaceListView({ workspaces }: { workspaces: Workspace[] }) {
  const { team_slug, workspace_slug } =
    (useParams() as { team_slug?: string; workspace_slug?: string }) ?? {};

  return (
    <Fold
      value={workspaces}
      ifPresent={(workspaces) => (
        <div className="Layout h-full w-full px-3">
          <Fold
            value={workspaces}
            ifPresent={(list) => (
              <ListView
                items={list}
                className="flex h-full flex-col gap-1 overflow-y-auto pt-2"
                renderItem={(workspace, index) => {
                  const isActive = workspace_slug === workspace.meta.slug;
                  return (
                    <SheetClose asChild key={index}>
                      <div className="flex place-content-between items-center">
                        <Link
                          href={`/${team_slug}/${workspace.meta.slug}`}
                          className={clsx(
                            "link group flex flex-grow items-center gap-2  rounded px-4 py-3 hover:bg-accent",
                            {
                              "text-primary ": isActive,
                            },
                          )}
                        >
                          <Circle
                            size={15}
                            fill={isActive ? "true" : "none"}
                            className={clsx("", {
                              hidden: isActive,
                              "text-muted-foreground": !isActive,
                            })}
                          />
                          <CircleCheck
                            size={15}
                            className={clsx("", {
                              "text-primary": isActive,
                              hidden: !isActive,
                            })}
                          />
                          <p
                            className={clsx(" ", {
                              "text-primary": isActive,
                              "text-muted-foreground": !isActive,
                            })}
                          >
                            {workspace.name}
                          </p>
                        </Link>
                        <WorkspaceSettingsDropDown
                          team_slug={team_slug}
                          workspace_slug={workspace.meta.slug}
                          className=" text-muted-foreground"
                        />
                      </div>
                    </SheetClose>
                  );
                }}
                noItemsElement={
                  <div className="bg-surface hover:bg-surface m-3 px-3  py-2 ">
                    <Label size="body" variant="s1">
                      Create a workspace to get started
                    </Label>
                  </div>
                }
              />
            )}
            ifAbsent={() => (
              <div className="bg-surface hover:bg-surface m-3 px-3  py-2 ">
                <Label size="body" variant="s1">
                  Create a workspace to get started
                </Label>
              </div>
            )}
          />
        </div>
      )}
      ifAbsent={() => (
        <div className=" m-3 flex h-full flex-col  place-content-center items-center bg-gray-100 px-3 py-2 hover:bg-gray-100">
          <LoadingSpinner />
        </div>
      )}
    />
  );
}
