import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Circle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";

import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import { DashBoardContext } from "@/app/(dashboard)/providers";
import { Team } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useContext } from "react";
import Label from "../atom/label";
import { Button } from "./button";
import { ListView } from "./listview";
import { LoadingSpinner } from "./loading-spinner";
import { SheetClose } from "./sheet";

export default function TeamToggleDropDown() {
  const data = useContext(TeamContext);
  console.log({ data });
  const { teams, error, loading } = useContext(DashBoardContext);
  const { workspace_slug } = (useParams() as { workspace_slug?: string }) ?? {};

  if (!teams || loading) {
    return <TeamToggleDropdownPlaceholder />;
  }

  const activeTeam =
    teams?.find((w) => w?.meta?.slug === workspace_slug) ?? teams?.[0];

  return (
    <div className="ml-4 flex items-center gap-2 bg-background">
      <div className="h-6 w-[2px] rotate-[30deg] bg-gray-200" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 ">
          <Button variant={"ghost"} className="flex items-center gap-2">
            {activeTeam?.name}
            <ChevronsUpDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border bg-background shadow">
          <DropdownMenuLabel>My Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {teams.map((team: any, index) => (
            <DropdownMenuItem key={index} id={`${index}`}>
              <TeamRow team={team} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TeamRow({ team }: { team: Team }) {
  const pathname = usePathname();
  const slug = pathname?.split("/").slice(0, 2).join("/");

  return (
    <div
      className="cursor-pointer py-1"
      onClick={() => {
        console.log({ team });
        redirect(`/${team.meta.slug}`);
      }}
    >
      <span className="text-sm">{team.name}</span>
    </div>
  );
}

function TeamToggleDropdownPlaceholder() {
  return (
    <div className="ml-5 flex animate-pulse items-center gap-6 rounded-lg px-2 py-2 sm:w-60">
      <div className="bg-m h-6 w-[1px] rotate-[30deg]" />
      <div className="hidden h-7 w-28  rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}

export function TeamListView({ teams }: any) {
  const pathname = usePathname();
  const slug = pathname?.split("/").slice(0, 2).join("/");
  // const isActive = pathname?.includes(slug ?? "");
  // console.log({ isActive, slug, pathname });

  function isActive(slug?: string): boolean {
    const pathArray = pathname?.split("/");
    return pathArray!.includes(slug ?? "");
  }

  return (
    <Fold
      value={teams}
      ifPresent={(teams) => (
        <div className="Layout h-full w-full px-3">
          <Fold
            value={teams}
            ifPresent={(list) => (
              <ListView
                items={list}
                className="flex h-full flex-col gap-1 overflow-y-auto"
                renderItem={(team, index) => (
                  <SheetClose asChild key={index}>
                    <Link
                      href={`${team.meta.slug}`}
                      className={cx(
                        "link group flex items-center gap-2 rounded  px-4 py-3",
                        {
                          "bg-primary text-primary-foreground":
                            pathname === `${slug}/${team.meta.slug}`,
                          "hover:bg-accent":
                            pathname !== `${slug}/${team.meta.slug}`,
                        },
                      )}
                    >
                      <Circle size={15} />
                      <span className="text-sm font-medium">{team.name}</span>
                    </Link>
                  </SheetClose>
                )}
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
