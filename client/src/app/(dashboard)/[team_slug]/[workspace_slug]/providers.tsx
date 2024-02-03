
"use client";

import { ReactNode, createContext } from "react";

import { Collection } from "@/lib/types/types";
import { PrettiFy } from "@/lib/utils";
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
    activeItem?:Collection;
}

export const WorkspaceContext = createContext(null) as unknown as React.Context<WorkspaceProviderProps>;
WorkspaceContext.displayName = "WorkspaceContext";

function WorkspaceProvider({ children }: { children: ReactNode }) {
    const { error, loading, collections } = useCollections();
    const param = useParams();
    const collectionSlug = param?.collection_slug;
    const activeCollection = collections?.find((c) => c?.meta?.slug === collectionSlug);

    const itemSlug = param?.item_slug;
    const activeItem = activeCollection?.children?.find((i:any) => i?.meta?.slug === itemSlug);
    

    // console.log('collections', collections);
    return <WorkspaceContext.Provider value={{ error, loading, collections: collections,activeCollection:activeCollection,activeItem:activeItem }}>
        {children}
    </WorkspaceContext.Provider>;
}