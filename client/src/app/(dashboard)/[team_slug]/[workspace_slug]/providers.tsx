
"use client";

import { ReactNode, createContext } from "react";

import { Collection } from "@/lib/types/types";
import { fetcher } from "@/lib/fetcher";
import useCollections from "@/lib/swr/use-collections";
import { useParams } from "next/navigation";

export default function Providers({ children }: { children: ReactNode }) {
    return <WorkspaceProvider>
        {children}
    </WorkspaceProvider>
}



interface WorkspaceProviderProps {
    loading: boolean;
    error: any;
    collections: Collection[];
    activeCollection?: Collection;
    activeItem?: Collection;
    UpdateActiveItem: (content: any) => void;
}

export const WorkspaceContext = createContext(null) as unknown as React.Context<WorkspaceProviderProps>;
WorkspaceContext.displayName = "WorkspaceContext";

function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { error, loading, collections } = useCollections();
    const param = useParams();
    const collectionSlug = param?.collection_slug;
    const activeCollection = collections?.find((c) => c?.meta?.slug === collectionSlug);

    const itemSlug = param?.item_slug;
    const activeItem = activeCollection?.children?.find((i: any) => i?.meta?.slug === itemSlug);

    // Save the active item in database
    async function UpdateActiveItem(content: any) {
        
        const teamSlug = param?.team_slug;
        const collectionSlug = param?.collection_slug;
        const workspaceSlug = param?.workspace_slug;
        const itemSlug = param?.item_slug;
        console.log('Saving');
        try {
            const response = await fetcher(`/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}/${activeItem?.meta?.slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: content }),
            })
            console.log('response', response);
        } catch (error) {
            console.error('error', error);
        }
    }


    // console.log('collections', collections);
    return <WorkspaceContext.Provider value={{
        error,
        loading,
        collections,
        activeCollection,
        activeItem,
        UpdateActiveItem
    }}>
        {children}
    </WorkspaceContext.Provider>;
}