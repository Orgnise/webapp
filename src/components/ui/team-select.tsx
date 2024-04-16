import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTeam from "@/lib/swr/use-team";
import useTeams from "@/lib/swr/use-teams";
import { Team } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Button } from "./button";

export function TeamToggleDropDown() {
  const data = useContext(TeamContext);
  const { error, loading: teamsLoading, teams } = useTeams();
  const { team: activeTeam, loading: teamLoading } = useTeam();
  if (!activeTeam && teamLoading) {
    return <TeamToggleDropdownPlaceholder />;
  }

  return (
    <div className="ml-4 flex items-center gap-2 bg-background">
      <div className=" h-6 w-[2px] rotate-[30deg] bg-gray-200" />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus-visible:outline-none">
          <Button variant={"ghost"} className="flex items-center gap-2">
            {activeTeam && (
              <Image
                unoptimized={true}
                height={32}
                width={32}
                src={activeTeam?.logo ?? ""}
                alt="user"
                className="h-8 w-8 rounded-full"
                onError={(e) => {
                  (e.target as any).src =
                    `https://api.dicebear.com/8.x/initials/svg?seed=${activeTeam?.name}&scale=70&size=40`;
                }}
              />
            )}
            {activeTeam?.name ?? "Not found"}
            <ChevronsUpDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border">
          <DropdownMenuLabel>
            <Link href="./">My Teams</Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Fold
            value={teamsLoading}
            ifPresent={(value) => (
              <div className="flex min-w-[224px] flex-col  gap-2.5 rounded p-3">
                <div className="h-8 w-full animate-pulse rounded bg-secondary" />
                <div className="h-8 w-full animate-pulse rounded bg-secondary" />
                <div className="h-8 w-full animate-pulse rounded bg-secondary" />
              </div>
            )}
            ifAbsent={() => (
              <div className="min-w-[224px] rounded p-3">
                <Fold
                  value={teams}
                  ifPresent={(teams: Team[]) => (
                    <div className="flex flex-col gap-1">
                      {teams
                        ?.filter((e) => e.meta)
                        .map((team: any, index) => (
                          <TeamRow team={team} key={index} />
                        ))}
                    </div>
                  )}
                  ifAbsent={() => (
                    <div>
                      <span className="max-w-[220px] truncate text-sm">
                        You are not part of any team
                      </span>
                    </div>
                  )}
                />
              </div>
            )}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TeamRow({ team }: { team: Team }) {
  const pathname = usePathname();
  return (
    <Link href={`/${team.meta.slug}`}>
      <div
        className={cx("flex w-full items-center  gap-2 rounded", {
          "bg-primary text-primary-foreground": pathname?.startsWith(
            `/${team.meta.slug}`,
          ),
          "hover:bg-accent": pathname !== `/${team.meta.slug}`,
        })}
      >
        <DropdownMenuItem className="w-full cursor-pointer ">
          <span className="max-w-[220px] truncate text-sm">{team.name}</span>
        </DropdownMenuItem>
      </div>
    </Link>
  );
}

function TeamToggleDropdownPlaceholder() {
  return (
    <div className="ml-5 flex animate-pulse items-center gap-6 rounded-lg px-2 py-2 sm:w-60">
      <div className="h-6 w-[1px] rotate-[30deg] bg-muted" />
      <div className="hidden h-7 w-28  rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}
