"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MutedLabel, P } from "../atom/typography";

import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import { MoreVertical } from "lucide-react";
import { Team } from "@/lib/types/types";

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
        <P className="p-4 rounded bg-muted ">
          You are not a member of any team yet. Create a new team or ask someone
          to invite you to their team
        </P>
      }
      placeholder={
        <div className="animate-pulse p-4 rounded  flex flex-col gap-2">
          <div className="h-8 bg-secondary rounded w-11/12"></div>
          <div className="h-8 bg-secondary rounded w-2/12"></div>
          <div className="h-4" />
          <div className="h-8 bg-secondary rounded w-11/12"></div>
          <div className="h-8 bg-secondary rounded w-2/12"></div>
          <div className="h-4" />
          <div className="h-8 bg-secondary rounded w-11/12"></div>
          <div className="h-8 bg-secondary rounded w-2/12"></div>
          <div className="h-4" />
          <div className="h-8 bg-secondary rounded w-11/12"></div>
          <div className="h-8 bg-secondary rounded w-2/12"></div>
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
    <div className="flex items-center py-2 first:border-t theme-border hover:bg-accent cursor-pointer px-2">
      <div className="mr-2 hover:cursor-pointer w-full">
        <div className="flex">
          <Link href={`/${team.meta.slug}`} className="flex-1">
            <P>{team.name}</P>
            <MutedLabel> {team.members.length} team members</MutedLabel>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="text-muted-foreground" />
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
