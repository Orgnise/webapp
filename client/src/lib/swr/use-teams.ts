import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../fetcher";
import { Team } from "../types/types";
interface ITeam {
  error: any;
  mutate: KeyedMutator<any>;
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
    mutate,
    loading: !teams && !error ? true : false,
  };
}