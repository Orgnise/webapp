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

import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import { DashBoardContext } from "@/app/(dashboard)/providers";
import Link from "next/link";
import { Logo } from "../atom/logo";
import { ModeToggle } from "../ui/toggle-theme";
import { Team } from "@/lib/types/types";
import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import cx from "classnames";
import { useContext } from "react";

const Nav = ({ }) => {
  const { team_slug } = useParams() as { team_slug?: string } ?? {};
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex items-center place-content-between w-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="Logo flex items-center gap-2">
          <Logo className="h-8" />
        </Link>
        {user && team_slug && <TeamToggleDropDown />}
      </div>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        {user && Object.keys(user).length !== 0 && (
          <div className="flex items-center space-x-4 ">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center place-content-center font-bold text-lg h-10 w-10 rounded-full bg-primary-200 hover:text-teal-700">
                  {user.image && (
                    <img
                      src={user.image}
                      alt="user"
                      className="h-8 w-8 rounded-full"
                      onError={(e) => {
                        (e.target as any).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
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
                  className="text-destructive cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                  onClick={() => signOut()}>
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
  const { teams, error, loading } = useContext(DashBoardContext);
  const { team_slug } = useParams() as { team_slug?: string } ?? {};


  if (!teams || loading) {
    return <TeamToggleDropdownPlaceholder />;
  }

  const activeTeam = teams?.find((w) => w?.meta?.slug === team_slug);

  return (
    <div className="flex items-center bg-background ml-4 gap-2">
      <div className="h-6 w-[2px] bg-gray-200 rotate-[30deg]" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 ">
          <Button variant={'ghost'} className="flex items-center gap-2">
            {activeTeam?.name ?? "Not found"}
            <ChevronsUpDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border">
          <DropdownMenuLabel>My Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {
            teams.map((team: any, index) =>
              <TeamRow team={team} key={index} />
            )
          }
        </DropdownMenuContent >
      </DropdownMenu>
    </div>
  );
}

function TeamRow({ team }: { team: Team }) {
  const pathname = usePathname();
  return (
    <Link href={`/${team.meta.slug}`}>
      <div className={cx("flex items-center gap-2 rounded w-full", {
        "bg-primary text-primary-foreground": pathname === `/${team.meta.slug}`,
        "hover:bg-accent": pathname !== `/${team.meta.slug}`
      })}>
        <DropdownMenuItem className="w-full cursor-pointer">
          <span className="text-sm">{team.name}</span>
        </DropdownMenuItem>
      </div>
    </Link>
  )

}

function TeamToggleDropdownPlaceholder() {
  return (
    <div className="flex animate-pulse items-center gap-6 rounded-lg px-2 py-2 sm:w-60 ml-5">
      <div className="h-6 w-[1px] bg-muted rotate-[30deg]" />
      <div className="hidden h-7 w-28  rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}