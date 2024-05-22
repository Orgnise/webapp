import { z } from "zod";
import { FREE_TEAMS_LIMIT } from "../constants";
import useTeam from "../swr/use-team";
import useTeams from "../swr/use-teams";
import useWorkspaces from "../swr/use-workspaces";
import { Team } from "../types";
import { LimitSchema } from "../zod/schemas";
import useUsers from "../swr/use-users";

interface IUsage {
  exceedingFreeTeam: boolean;
  exceedingWorkspaceLimit: boolean;
  exceedingMembersLimit: boolean;
  usage: z.infer<typeof LimitSchema>
  limit: z.infer<typeof LimitSchema>
}
export default function useUsage(): IUsage {
  const { teams, loading: teamsLoading } = useTeams();
  const { limit, usage, loading: teamLoading, membersCount } = useTeam();
  const { workspaces, loading: workspacesLoading } = useWorkspaces();
  const { users } = useUsers();

  const freeTeams = teams?.filter((team: Team) => team.role === "owner" && team.plan === "free");

  const workspaceLimitInTeam = limit?.workspaces;

  return {
    limit,
    usage,
    exceedingFreeTeam: freeTeams?.length > FREE_TEAMS_LIMIT,
    exceedingWorkspaceLimit: Math.min(workspaces?.length, usage?.workspaces) >= workspaceLimitInTeam,
    exceedingMembersLimit: Math.min(users.length, usage?.users) >= limit?.users,
  };
}