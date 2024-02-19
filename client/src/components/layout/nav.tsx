"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";

import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import useTeams from "@/lib/swr/use-teams";
import { Team } from "@/lib/types/types";
import cx from "classnames";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { Logo } from "../atom/logo";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/toggle-theme";

const Nav = ({}) => {
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex w-full place-content-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="Logo flex items-center gap-2">
          <Logo className="h-8" />
        </Link>
        {user && team_slug && <TeamToggleDropDown />}
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        {user && Object.keys(user).length !== 0 && (
          <div className="flex items-center space-x-4 ">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="bg-primary-200 flex h-10 w-10 place-content-center items-center rounded-full text-lg font-bold hover:text-teal-700">
                  {user.image && (
                    <img
                      src={user.image}
                      alt="user"
                      className="h-8 w-8 rounded-full"
                      onError={(e) => {
                        (e.target as any).src =
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                      }}
                    />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-border">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  onClick={() => signOut()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};
export default Nav;

export function TeamToggleDropDown() {
  const data = useContext(TeamContext);
  const { error, loading, teams } = useTeams();
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};

  if (!teams || loading) {
    return <TeamToggleDropdownPlaceholder />;
  }

  const activeTeam = teams?.find((w) => w?.meta?.slug === team_slug);

  return (
    <div className="ml-4 flex items-center gap-2 bg-background">
      <div className="h-6 w-[2px] rotate-[30deg] bg-gray-200" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus-visible:outline-none">
          <Button variant={"ghost"} className="flex items-center gap-2">
            {activeTeam?.name ?? "Not found"}
            <ChevronsUpDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border">
          <DropdownMenuLabel>My Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex min-w-[224px] flex-col gap-2.5 rounded p-3">
            {teams.map((team: any, index) => (
              <TeamRow team={team} key={index} />
            ))}
          </div>
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
          "bg-primary text-primary-foreground":
            pathname === `/${team.meta.slug}`,
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
