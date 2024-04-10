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
import { useParams } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import { Logo } from "../atom/logo";
import { TeamToggleDropDown } from "../ui/team-select";
import { ModeToggle } from "../ui/toggle-theme";

const Nav = ({}) => {
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex h-16 w-full place-content-between items-center">
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
                  <Image
                    unoptimized={true}
                    height={32}
                    width={32}
                    src={user.image ?? ""}
                    alt="user"
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      (e.target as any).src =
                        `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                    }}
                  />
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
