import { P } from "@/components/atom/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  team_slug?: string;
  workspace_slug?: string;
  className?: string;
}
export function WorkspaceSettingsDropDown({
  team_slug,
  workspace_slug,
  className,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(clsx("flex items-center gap-2"), className)}
      >
        <button className="">
          <MoreVerticalIcon size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer rounded-sm">
          <Link href={`/${team_slug}/${workspace_slug}/settings`}>
            <P>Workspace Settings</P>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
