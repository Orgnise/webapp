"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSession, signOut } from "next-auth/react";
import Logo from "../atom/logo";
import { ModeToggle } from "../ui/toggle-theme";

const Nav = () => {
  const { data: session } = useSession();
  const user = session?.user as any;
  const handleLogout = () => {};

  return (
    <div className="flex items-center place-content-between w-full">
      <div className="flex items-center flex-shrink-0  w-64">
        <Logo />
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
                    />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-primary cursor-pointer"
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
