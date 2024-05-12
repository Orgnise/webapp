"use client";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="m-0 w-full flex-grow gap-1 rounded  p-0 px-2 sm:min-w-[200px]">
        <span className="my-1 flex flex-grow cursor-pointer flex-row  place-content-between items-center  text-sm hover:bg-accent">
          <span className="flex items-center gap-1">
            {theme === "light" && <Sun className="" size={17} />}
            {theme === "dark" && <Moon className=" " size={17} />}
            {theme === "system" && (
              <Laptop className=" mr-2 h-[1rem] w-[1rem] " size={17} />
            )}
            <span>Theme</span>
            <span className="capitalize">{theme}</span>
          </span>
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="rounded-md border-border">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setTheme("light");
              document.documentElement.classList.remove("dark-theme");
            }}
          >
            <Sun className="mr-2 h-[1.2rem] w-[1.2rem]" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setTheme("dark");
              // Workaround for the Novel editor
              document.documentElement.classList.add("dark-theme");
            }}
          >
            <Moon className=" mr-2 h-[1.2rem] w-[1.2rem]" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setTheme("system");
              document.documentElement.classList.remove("dark-theme");
            }}
          >
            <Laptop className=" mr-2 h-[1.2rem] w-[1.2rem] " />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
    // </>
  );
}
