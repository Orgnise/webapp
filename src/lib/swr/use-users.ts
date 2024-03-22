import { useParams } from "next/navigation";
import useSWR from "swr";
import { UserProps } from "../types/types";
import { fetcher } from "../fetcher";

export default function useUsers({ invites }: { invites?: boolean } = {}) {
  const { team_slug } = useParams() as {
    team_slug: string;
  };

  const { data: res, error } = useSWR<{ users: UserProps[] }>(
    team_slug &&
    (invites
      ? `/api/teams/${team_slug}/invites`
      : `/api/teams/${team_slug}/users`),
    fetcher,
  );

  return {
    users: res?.users,
    loading: !error && !res?.users,
    error,
  };
}