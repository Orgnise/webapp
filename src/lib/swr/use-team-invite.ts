import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../fetcher";
import { InviteTeamMemberSchema } from "../zod/schemas";
import { z } from "zod";
interface Props {
  users: z.infer<typeof InviteTeamMemberSchema>[],
  loading: boolean,
  error: any
}

export default function useTeamInvite(): Props {
  const { team_slug } = useParams() as {
    team_slug: string;
  };

  const { data: res, error } = useSWR<any>(
    team_slug && `/api/teams/${team_slug}/invites`,
    fetcher,
  );

  return {
    users: res?.users ?? [],
    loading: !error && !res?.users,
    error,
  };
}
