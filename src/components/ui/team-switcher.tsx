import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DICEBEAR_AVATAR_URL } from "@/lib/constants/constants";
import useTeams from "@/lib/swr/use-teams";
import { Plan, Team } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Badge } from "./badge";

export function TeamSwitcher() {
  const { error, loading: teamsLoading, teams } = useTeams();
  const { data } = useSession();
  const { key, team_slug } = useParams() as {
    team_slug?: string;
    key?: string;
  };

  const selected = useMemo(() => {
    const selectedTeam = teams?.find(
      (workspace) => workspace?.meta?.slug === team_slug,
    );

    if (team_slug && teams && selectedTeam) {
      return {
        ...selectedTeam,
        image:
          selectedTeam.logo || `${DICEBEAR_AVATAR_URL}${selectedTeam.name}`,
        slug: selectedTeam.meta.slug,
        plan: selectedTeam.plan ?? "free",
      };

      // return personal account selector if there's no workspace or error (user doesn't have access to workspace)
    } else {
      return {
        name: data?.user?.name || data?.user?.email,
        slug: "/",
        image: data?.user?.image || DICEBEAR_AVATAR_URL + data?.user?.email,
        plan: "free",
      };
    }
  }, [team_slug, teams, data]) as {
    id?: string;
    name: string;
    slug: string;
    image: string;
    plan: Plan;
  };

  if (!teams || teamsLoading) {
    return <TeamToggleDropdownPlaceholder />;
  }

  return (
    <div className="flex items-center gap-2 bg-background">
      <div className=" mr-4 hidden h-6 w-[2px] rotate-[30deg] bg-gray-200 sm:flex" />

      <Link
        href={`/${selected?.slug}`}
        className="flex cursor-pointer items-center gap-1.5"
      >
        {selected && (
          <Image
            unoptimized={true}
            height={32}
            width={32}
            src={selected.image}
            alt="user"
            className="h-8 w-8 rounded-full"
            onError={(e) =>
              ((e.target as any).src = DICEBEAR_AVATAR_URL + selected?.name)
            }
          />
        )}
        {selected.name}
        {selected.slug !== "/" && <Badge>{selected.plan}</Badge>}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus-visible:outline-none">
          <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent">
            <ChevronsUpDown size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-border">
          <DropdownMenuLabel>
            <Link href="./">My Teams</Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Fold
            value={teamsLoading}
            ifPresent={(value) => (
              <div className="flex min-w-[224px] flex-col  gap-2.5 rounded p-3">
                <div className="h-8 w-full animate-pulse rounded bg-secondary" />
                <div className="h-8 w-full animate-pulse rounded bg-secondary" />
                <div className="h-8 w-full animate-pulse rounded bg-secondary" />
              </div>
            )}
            ifAbsent={() => (
              <div className="min-w-[224px] rounded p-3">
                <Fold
                  value={teams}
                  ifPresent={(teams: Team[]) => (
                    <div className="flex flex-col gap-1">
                      {teams
                        ?.filter((e) => e.meta)
                        .map((team: any, index) => (
                          <TeamRow
                            team={team}
                            key={index}
                            selectedSlug={selected.slug}
                          />
                        ))}
                    </div>
                  )}
                  ifAbsent={() => (
                    <div>
                      <span className="max-w-[220px] truncate text-sm">
                        You are not part of any team
                      </span>
                    </div>
                  )}
                />
              </div>
            )}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function TeamRow({ team, selectedSlug }: { team: Team; selectedSlug: string }) {
  const isSelected = selectedSlug === team.meta.slug;
  return (
    <Link href={`/${team.meta.slug}`}>
      <div
        className={cx(
          "flex w-full items-center  gap-2 rounded hover:bg-accent",
        )}
      >
        <DropdownMenuItem className="w-full cursor-pointer ">
          <span className="flex max-w-[220px] items-center gap-2 truncate text-sm">
            <Image
              id={`team_${team?._id}`}
              unoptimized={true}
              height={32}
              width={32}
              src={team?.logo ?? DICEBEAR_AVATAR_URL + team.name}
              alt="user"
              className="h-6 w-6 rounded-full"
              onError={(e) => {
                (e.target as any).src = DICEBEAR_AVATAR_URL + team.name;
              }}
            />
            {team.name}
            <CheckIcon
              className={cx("h-4 w-4", {
                "text-primary": isSelected,
                hidden: !isSelected,
              })}
            />
          </span>
        </DropdownMenuItem>
      </div>
    </Link>
  );
}

function TeamToggleDropdownPlaceholder() {
  return (
    <div className="ml-5 flex animate-pulse items-center gap-6 rounded-lg px-2 py-2 sm:w-60">
      <div className="h-6 w-[1px] rotate-[30deg] bg-muted" />
      <div className="hidden h-7 w-28  rounded-md bg-gray-200 sm:block sm:w-40" />
      <ChevronsUpDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
    </div>
  );
}
