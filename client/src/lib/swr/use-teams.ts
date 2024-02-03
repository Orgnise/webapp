import useSWR, { KeyedMutator } from "swr";

import { Team } from "../types/types";
import { fetcher } from "../fetcher";
interface ITeam {
  error: any;
  loading: boolean;
  teams: Team[];
}
export default function useTeams(): ITeam {

  const {
    data: teams,
    error,
    mutate,
  } = useSWR<any>(`/api/teams`, fetcher, {
    dedupingInterval: 30000,
  });

  return {
    ...teams,
    error,
    loading: !teams && !error ? true : false,
  };
}