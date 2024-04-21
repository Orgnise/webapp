"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import { LogOutIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../atom/logo";
import { TeamSwitcher } from "../ui/team-switcher";
import { ThemeSwitcher } from "../ui/theme-switcher";

const Nav = ({}) => {
  const { team_slug } = (useParams() as { team_slug?: string }) ?? {};
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <div className="flex h-16 w-full place-content-between items-center">
      <div className="flex items-center gap-2">
        <Link href="/" className="Logo flex items-center gap-2">
          <Logo className="h-8" />
        </Link>
        {user && <TeamSwitcher />}
      </div>
      <div className="flex items-center gap-2">
        {status === "loading" && (
          <div className="h-8 w-8 animate-pulse rounded-full bg-accent" />
        )}
        {user && Object.keys(user).length !== 0 && (
          <div className="flex items-center space-x-4 ">
            <DropdownMenu>
              <DropdownMenuTrigger className="group">
                <div className="bg-primary-200  flex h-10 w-10 place-content-center items-center rounded-full text-lg font-bold hover:text-teal-700">
                  <Image
                    unoptimized={true}
                    height={40}
                    width={40}
                    src={user.image ?? ""}
                    alt="user"
                    className="h-10 w-10 rounded-full border border-border group-active:scale-95"
                    onError={(e) => {
                      (e.target as any).src =
                        `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}&scale=70&size=40`;
                    }}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="max-w-[224px] border-border p-2"
                align="end"
              >
                <div className=" p-2 text-sm">
                  <p className="truncate whitespace-nowrap font-bold">
                    {user.name}
                  </p>
                  <p className="truncate text-secondary-foreground/85">
                    {user.email}
                  </p>
                </div>
                <ThemeSwitcher />
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/settings" className="flex items-center">
                    <Settings size={18} className="mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOutIcon size={18} className="mr-2" /> Logout
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
