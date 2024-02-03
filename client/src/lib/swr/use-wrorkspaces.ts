"use client";

import { useParams, usePathname } from "next/navigation";

import { PrettiFy } from "../utils";
import { Workspace } from "../types/types";
import { fetcher } from "../fetcher";
import useSWR from "swr";

interface IWorkspaces {
  error: any;
  // mutate: KeyedMutator<any>;
  loading: boolean;
  workspaces: Workspace[];
}
export default function useWorkspaces(): IWorkspaces {
  const { team_slug } = useParams() as { team_slug?: string };
  const {
    data: data,
    error,
  } = useSWR<any>(`/api/teams/${team_slug}/workspaces`, fetcher, {
    dedupingInterval: 30000,
  });


  if (!team_slug) {
    return {
      error: "No slug",
      loading: false,
      workspaces: [],
    }
  }

  return {
    workspaces: data?.workspaces,
    error,
    loading: !data && !error ? true : false,
  };
}