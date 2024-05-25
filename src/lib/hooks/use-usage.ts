import { useMemo } from "react";
import { z } from "zod";
import { FREE_TEAMS_LIMIT } from "../constants";
import useCollections from "../swr/use-collections";
import useTeam from "../swr/use-team";
import useTeams from "../swr/use-teams";
import useUsers from "../swr/use-users";
import useWorkspaces from "../swr/use-workspaces";
import { Team } from "../types";
import { flattenCollectionTree } from "../utility/collection-tree-structure";
import { LimitSchema } from "../zod/schemas";

interface IUsage {
  exceedingFreeTeam: boolean;
  exceedingWorkspaceLimit: boolean;
  exceedingMembersLimit: boolean;
  exceedingPageLimit: boolean;
  usage: z.infer<typeof LimitSchema>
  limit: z.infer<typeof LimitSchema>
}
export default function useUsage(): IUsage {
  const { teams, loading: teamsLoading } = useTeams();
  const { limit, usage, loading: teamLoading, membersCount } = useTeam();
  const { workspaces, loading: workspacesLoading } = useWorkspaces();
  const { collections } = useCollections();
  const { users } = useUsers();

  const freeTeams = teams?.filter((team: Team) => team.role === "owner" && team.plan === "free");
  const workspaceLimitInTeam = limit?.workspaces;
  const flatCollections = useMemo(() => flattenCollectionTree(collections).filter((collection) => collection?.object === "item"), [collections]);
  const pagesCount = collections && flatCollections?.length;

  return {
    usage: {
      pages: pagesCount ?? usage?.pages,
      users: membersCount ?? usage?.users,
      workspaces: workspaces?.length ?? usage?.workspaces
    },
    limit,
    exceedingFreeTeam: freeTeams?.length > FREE_TEAMS_LIMIT,
    exceedingWorkspaceLimit: (workspaces?.length ?? usage?.workspaces) >= workspaceLimitInTeam,
    exceedingMembersLimit: (users?.length ?? usage?.users) >= limit?.users,
    exceedingPageLimit: (pagesCount ?? usage?.pages) >= limit?.pages,
  };
}