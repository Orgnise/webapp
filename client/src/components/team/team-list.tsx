"use client";
import Label from "@/components/atom/label";
import { ListView } from "@/components/ui/listview";
import { Team } from "@/lib/types/types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { H4, LargeLabel, MutedLabel, P, SmallLabel } from "../atom/typography";

interface Props {
  teams: Team[];
  loading: boolean;
}
export default async function TeamsList(prop: Props) {
  return (
    <ListView
      items={prop.teams}
      loading={prop.loading}
      noItemsElement={
        <P className="p-4 rounded bg-muted">
          You are not a member of any team yet. Create a new team or ask someone
          to invite you to their team
        </P>
      }
      placeholder={
        <div className="animate-pulse p-4 rounded bg-surface flex flex-col gap-2">
          <div className="h-8 bg-onSurface rounded w-11/12"></div>
          <div className="h-8 bg-onSurface rounded w-2/12"></div>
          <div className="h-4" />
          <div className="h-8 bg-onSurface rounded w-11/12"></div>
          <div className="h-8 bg-onSurface rounded w-2/12"></div>
          <div className="h-4" />
          <div className="h-8 bg-onSurface rounded w-11/12"></div>
          <div className="h-8 bg-onSurface rounded w-2/12"></div>
          <div className="h-4" />
          <div className="h-8 bg-onSurface rounded w-11/12"></div>
          <div className="h-8 bg-onSurface rounded w-2/12"></div>
        </div>
      }
      renderItem={(team, index) => (
        <TeamRow key={index} team={team} index={index} />
      )}
    />
  );
}

function TeamRow({ team, index }: any) {
  return (
    <div className="flex items-center py-2 first:border-t theme-border hover:bg-surface cursor-pointer">
      <div className=" mr-2 hover:cursor-pointer w-full">
        <div className="flex">
          <Link href={`/${team.meta.slug}`} className="flex-1">
            <P>{team.name}</P>
            <MutedLabel> {team.members.length} team members</MutedLabel>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="text-secondary" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
