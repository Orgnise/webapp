import { ChevronsUpDown, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, usePathname } from "next/navigation";

import { Button } from "./button";
import { DashBoardContext } from "@/app/(dashboard)/providers";
import { Fold } from "@/lib/utils";
import Label from "../atom/label";
import Link from "next/link";
import { ListView } from "./listview";
import { LoadingSpinner } from "./loading-spinner";
import { SheetClose } from "./sheet";
import { Team } from "@/lib/types/types";
import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import cx from "classnames";
import { redirect } from 'next/navigation';
import { useContext } from "react";

export default function TeamToggleDropDown() {
  const data = useContext(TeamContext);
  console.log({ data });
  const { teams, error, loading } = useContext(DashBoardContext);
  const { workspace_slug } = useParams() as { workspace_slug?: string } ?? {};


  if (!teams || loading) {
    return <TeamToggleDropdownPlaceholder />;
  }

  const activeTeam = teams?.find((w) => w?.meta?.slug === workspace_slug) ?? teams?.[0];

  return (
    <div className="flex items-center bg-background ml-4 gap-2">
      <div className="h-6 w-[2px] bg-gray-200 rotate-[30deg]" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 ">
          <Button variant={'ghost'} className="flex items-center gap-2">
            {activeTeam?.name}
            <ChevronsUpDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-background border shadow">
          <DropdownMenuLabel>My Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            teams.map((team: any, index) =>
              <DropdownMenuItem key={index} id={`${index}`}>
                <TeamRow team={team} />
              </DropdownMenuItem>
            )
          }
        </DropdownMenuContent >
      </DropdownMenu>
    </div>
  );
}

function TeamRow({ team }: { team: Team }) {
  const pathname = usePathname();
  const slug = pathname?.split('/').slice(0, 2).join('/');

  return (
    <div
      className="cursor-pointer py-1"
      onClick={() => {
        console.log({ team });
        redirect(`/${team.meta.slug}`)
      }}>
      <span className="text-sm">{team.name}</span>
    </div>
  )

}



function TeamToggleDropdownPlaceholder() {
  return (
    <div className="flex animate-pulse items-center gap-6 rounded-lg px-2 py-2 sm:w-60 ml-5">
      <div className="h-6 w-[1px] bg-m rotate-[30deg]" />
      <div className="hidden h-7 w-28  rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}



export function TeamListView({ teams }: any) {

  const pathname = usePathname();
  const slug = pathname?.split('/').slice(0, 2).join('/');
  // const isActive = pathname?.includes(slug ?? "");
  // console.log({ isActive, slug, pathname });

  function isActive(slug?: string): boolean {
    const pathArray = pathname?.split('/');
    return pathArray!.includes(slug ?? "")
  }

  return (

    <Fold
      value={teams}
      ifPresent={(teams) => (
        <div className="Layout px-3 w-full h-full">
          <Fold
            value={teams}
            ifPresent={(list) => (
              <ListView
                items={list}
                className="flex flex-col gap-1 overflow-y-auto h-full"
                renderItem={(team) => (
                  <SheetClose asChild>

                    <Link
                      href={`${team.meta.slug}`}
                      className={cx("group link py-3 flex items-center gap-2  rounded px-4", {
                        "bg-primary text-primary-foreground": pathname === `${slug}/${team.meta.slug}`,
                        "hover:bg-accent": pathname !== `${slug}/${team.meta.slug}`
                      })}
                    >
                      <Circle size={15} />
                      <span className="text-sm font-medium">{team.name}</span>
                    </Link>

                  </SheetClose>
                )}
                noItemsElement={
                  <div className="px-3 py-2 bg-surface hover:bg-surface  m-3 ">
                    <Label size="body" variant="s1">
                      Create a workspace to get started
                    </Label>
                  </div>
                }
              />
            )}
            ifAbsent={() => (
              <div className="px-3 py-2 bg-surface hover:bg-surface  m-3 ">
                <Label size="body" variant="s1">
                  Create a workspace to get started
                </Label>
              </div>
            )}
          />
        </div>
      )}
      ifAbsent={() => (
        <div className=" px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 h-full flex flex-col items-center place-content-center">
          <LoadingSpinner />
        </div>
      )}
    />
  );
}
