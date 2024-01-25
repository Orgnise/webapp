"use client";
import { H3 } from "@/components/atom/typography";
import TeamsList from "@/components/team/team-list";
import { Button } from "@/components/ui/button";
import useTeams from "@/lib/swr/use-teams";
import Link from "next/link";

export default function DashboardPageClient() {
  const data = useTeams();
  return (
    <div className="h-screen flex flex-col bg-background">
      <section className="flex flex-col py-4 md:py-7 md:px-8 xl:px-10 h-full overflow-y-auto items-center">
        <div className="divide-y max-w-xl w-full px-2 sm:px-0 pt-28">
          <div className="flex flex-col  gap-5 ">
            <div className="flex place-content-between">
              <H3>Team</H3>
              <Link href="/create">
                <Button>Create Team</Button>
              </Link>
            </div>
            <TeamsList loading={data.loading} teams={data.teams} />
          </div>
        </div>
      </section>
    </div>
  );
}
