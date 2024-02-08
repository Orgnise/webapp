import { Collection } from "../types/types";
import useSWR, { KeyedMutator } from "swr";

import { fetcher } from "../fetcher";
import { useParams } from "next/navigation";

interface IWorkspaces {
    error: any;
    mutate: KeyedMutator<any>;
    loading: boolean;
    collections: Collection[];
}
export default function useCollections(): IWorkspaces {
    const { team_slug, workspace_slug } = useParams() as { team_slug?: string, workspace_slug?: string };

    const {
        data: data,
        error,
        mutate,
    } = useSWR<any>(`/api/teams/${team_slug}/${workspace_slug}/collections`, fetcher, {
        dedupingInterval: 30000,
    });


    if (!team_slug || !workspace_slug) {
        return {
            mutate,
            error: "No slug or workspaceId provided",
            loading: false,
            collections: [],
        }
    }
    return {
        mutate,
        collections: data?.collections,
        error,
        loading: !data && !error ? true : false,
    };
}