import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "../fetcher";

export default function useTeam() {
  const { slug } = useParams() as { slug?: string };

  const {
    data: team,
    error,
    mutate,
  } = useSWR<any>(slug && `/api/teams/${slug}`, fetcher, {
    dedupingInterval: 30000,
  });

  return {
    team,
    error,
    mutate,
    loading: slug && !team && !error ? true : false,
  };
}