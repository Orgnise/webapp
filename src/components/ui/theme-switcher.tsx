"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Laptop, Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuSeparator />
      <DropdownMenuTrigger asChild className="sm:min-w-[200px]">
        <span className="my-2 flex cursor-pointer flex-row place-content-between items-center rounded border border-border px-2 py-1.5 text-sm hover:bg-accent">
          <span>Theme</span>

          <span className="flex items-center gap-1">
            {theme === "light" && <Sun className="" size={17} />}
            {theme === "dark" && <Moon className=" " size={17} />}
            {theme === "system" && (
              <Laptop className=" mr-2 h-[1rem] w-[1rem] " size={17} />
            )}
            <span className="capitalize">{theme}</span>
            <ChevronDown className="h-4 w-4" />
          </span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuSeparator />
      <DropdownMenuContent align="end" className="rounded-md border-border">
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
