import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../fetcher";

export default function useTeamInvite() {
  const { team_slug } = useParams() as {
    team_slug: string;
  };

  const { data: res, error } = useSWR<any>(
    team_slug &&
    `/api/teams/${team_slug}/invites`,
    fetcher,
  );

  return {
    users: res?.users ?? [],
    loading: !error && !res?.users,
    error,
  };
}