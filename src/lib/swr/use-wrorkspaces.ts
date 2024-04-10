"use client";

import { useParams } from "next/navigation";
import useSWR, { KeyedMutator } from "swr";

import { fetcher } from "../fetcher";
import { Workspace } from "../types/types";

interface IWorkspaces {
  error: any;
  mutate: KeyedMutator<any>;
  loading: boolean;
  workspaces: Workspace[];
}
export default function useWorkspaces(): IWorkspaces {
  const { team_slug } = useParams() as { team_slug?: string };
  const {
    data: data,
    error,
    mutate,
  } = useSWR<any>(`/api/teams/${team_slug}/workspaces`, fetcher, {
    dedupingInterval: 120000,
  });

  if (!team_slug) {
    return {
      mutate,
      error: "No slug",
      loading: false,
      workspaces: [],
    };
  }

  return {
    mutate,
    workspaces: data?.workspaces,
    error,
    loading: !data && !error ? true : false,
  };
}
