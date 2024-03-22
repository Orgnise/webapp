"use client";

import { ListView } from "@/components/ui/listview";
import useTeams from "@/lib/swr/use-teams";
import { Team } from "@/lib/types/types";
import { pluralize } from "@/lib/utils";
import { Shapes, UserCircle2Icon } from "lucide-react";
import Link from "next/link";
import { Logo } from "../atom/logo";
import { P } from "../atom/typography";
import { Badge } from "../ui/badge";

export default function TeamsList() {
  const data = useTeams();
  const { loading, teams } = useTeams();

  return (
    <>
      <ListView
        items={teams}
        loading={data.loading}
        className="mx-auto grid max-w-screen-xl grid-cols-1 gap-5 px-2.5 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-20"
        renderItem={(item: Team, index: number) => (
          <TeamCard key={index} team={item} index={index} />
        )}
        noItemsElement={
          <div className="flex h-full w-full flex-col place-content-center items-center py-20 text-center">
            <Shapes className="text-accent" size={60} />
            <P className="mt-6">No Team available</P>
            <P className="max-w-xs py-4 text-center text-sm text-muted-foreground">
              You are not a member of any team yet. Create a new team or ask
              someone to invite you to their team
            </P>
          </div>
        }
        placeholder={
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-5 px-2.5 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-20">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex h-[146px] w-full cursor-pointer flex-col place-content-between items-start rounded border border-border bg-card p-6   hover:text-accent-foreground hover:shadow"
              >
                <div className="flex w-full items-center gap-2">
                  <div className="h-14 w-14 min-w-[56px] rounded-full bg-secondary "></div>
                  <div className="flex w-full flex-col gap-1">
                    <div className="h-6 w-4/12 rounded bg-secondary"></div>
                    <div className="h-3 w-3/12 rounded bg-secondary"></div>
                  </div>
                </div>

                <div className="flex items-center gap-1 pl-2">
                  <div className="h-4 w-4 rounded-full bg-secondary " />
                  <div className="h-4 w-20 rounded bg-secondary " />
                </div>
              </div>
            ))}
          </div>
        }
      />
    </>
  );
}

function TeamCard({ team, index }: any) {
  return (
    <Link
      key={index}
      href={`/${team.meta.slug}`}
      className="prose-base flex w-full cursor-pointer flex-col place-content-between items-start rounded border border-border bg-card p-4   hover:text-accent-foreground hover:shadow"
    >
      <div className=" flex w-full items-center gap-4">
        <Logo className="h-10 flex-none" />
        <div className="flex flex-grow place-content-between items-start">
          <div className="flex-grow flex-col items-center">
            <div className="flex w-full place-content-between items-center">
              <h3 className="m-0 max-w-[200px] truncate p-0">{team.name}</h3>
            </div>
            {team?.description && (
              <p className="m-0 text-sm text-muted-foreground">
                {team.description}
              </p>
            )}
          </div>
          <Badge className="mt-1">{team.plan ?? "Free"}</Badge>
        </div>
      </div>
      <span className="flex items-center gap-1 pt-6 text-sm text-muted-foreground">
        <UserCircle2Icon className="" size={16} />
        {/* TODO: Fetch and display members/workspaces count */}
        {team?.members?.length}
        <span className="pl-px">
          {pluralize("member", team?.members?.length)}
        </span>
      </span>
    </Link>
  );
}
