"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Collection } from "@/lib/types/types";
import { fetcher } from "@/lib/fetcher";
import useCollections from "@/lib/swr/use-collections";
import { useToast } from "@/components/ui/use-toast";

export default function Providers({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

interface WorkspaceProviderProps {
  loading: boolean;
  error: any;
  collections: Collection[];
  activeCollection?: Collection;
  activeItem?: Collection;
  updateCollection: (collection: Collection) => void;
  /**
   * Create a new collection / Item
   * To create item, pass the parent collection slug
   */
  createCollection(collection: Collection): Promise<void>;
  UpdateActiveItem: (item: Collection, parent: Collection) => void;
  deleteCollection(collectionSlug: string): Promise<void>;
  deleteItem(itemSlug: string, collectionSlug: string): Promise<void>;
}

export const WorkspaceContext = createContext(
  null
) as unknown as React.Context<WorkspaceProviderProps>;
WorkspaceContext.displayName = "WorkspaceContext";

function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeCollection, setActiveCollection] = useState<Collection>();
  const [activeItem, setActiveItem] = useState<Collection>();
  const { error, loading, collections, mutate } = useCollections();
  const { toast } = useToast();

  const param = useParams();
  const router = useRouter();

  // Set the active collection
  useEffect(() => {
    if (!param?.collection_slug) {
      setActiveCollection(undefined);
      return;
    }
    // Update the active collection if the collection slug has changed
    if (
      !activeCollection ||
      activeCollection?.meta?.slug !== param?.collection_slug
    ) {
      setActiveCollection(
        collections?.find((c) => c?.meta?.slug === param?.collection_slug)
      );
    }
  }, [param?.collection_slug, collections]);

  // Set the active item
  useEffect(() => {
    if (!param?.item_slug) {
      setActiveItem(undefined);
      return;
    }
    // Update the active item if the item slug has changed
    if (!activeItem || activeItem?.meta?.slug !== param?.item_slug) {
      setActiveItem(
        activeCollection?.children?.find(
          (i: any) => i?.meta?.slug === param?.item_slug
        )
      );
    }
  }, [param?.item_slug, activeCollection]);

  // Update the active item in database
  async function UpdateActiveItem(item: Collection, parent: Collection) {
    console.log("Updating active item", item.name);
    const teamSlug = param?.team_slug;
    const collectionSlug = parent?.meta?.slug;
    const workspaceSlug = param?.workspace_slug;
    const activeItemSlug = param?.item_slug;
    try {
      const response = await fetcher(
        `/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}/${item?.meta?.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ item: item }),
        }
      );
      const list = collections.map((c) => {
        if (c._id === parent._id) {
          c.children = c.children.map((i: any) => {
            if (i._id === item._id) {
              return response.item;
            }
            return i;
          });
        }
        return c;
      });
      setActiveItem(response.item);

      if (activeItemSlug && activeItemSlug !== response.item?.meta?.slug) {
        router.replace(
          `/${teamSlug}/${workspaceSlug}/${collectionSlug}/${response?.item.meta.slug}`
        );
      }

      mutate({ collections: list }, { revalidate: false });
    } catch (error) {
      console.error("error", error);
    }
  }

  // Create a new Collection/Item
  async function createCollection(collection: Collection) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;

    try {
      const response = await fetcher(
        `/api/teams/${teamSlug}/${workspaceSlug}/collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collection: collection }),
        }
      );
      toast({
        title: "Success",
        description: response?.message,
      });
      if (collection.object === "collection") {
        const list = [...collections, response.collection];
        setActiveCollection(response.collection);
        mutate({ collections: list }, { revalidate: false });
        console.log("Collection created");
        router.push(
          `/${teamSlug}/${workspaceSlug}/${response.collection.meta.slug}`
        );
      } else {
        const list = collections.map((c) => {
          if (c._id === collection.parent) {
            c.children.push(response.collection);
          }
          return c;
        });
        console.log("Item created");
        mutate({ collections: list }, { revalidate: false });
      }
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  // Update collection name
  async function updateCollection(collection: Collection) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;
    const collectionSlug = collection?.meta?.slug;
    try {
      const response = await fetcher(
        `/api/teams/${teamSlug}/${workspaceSlug}/${collection?.meta?.slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collection: collection }),
        }
      );
      const list = collections.map((c) => {
        if (c.meta.slug === collectionSlug) {
          return response.collection;
        }
        return c;
      });
      setActiveCollection(response.collection);
      // Change the url if the collection slug has changed
      if (
        collectionSlug === activeCollection?.meta.slug &&
        collectionSlug != response.collection.meta.slug
      ) {
        router.replace(
          `/${teamSlug}/${workspaceSlug}/${response.collection.meta.slug}`
        );
      }
      mutate({ collections: list }, { revalidate: false });
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  // Delete collection
  async function deleteCollection(collectionSlug: string) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;
    const activeCollectionSlug = param?.collection_slug;
    try {
      fetcher(`/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}`, {
        method: "DELETE",
      }).then((data) => {
        toast({
          title: "Collection deleted",
          description: "Collection has been deleted successfully",
        });
        const list = collections.filter((c) => c.meta?.slug !== collectionSlug);
        if (activeCollectionSlug === collectionSlug) {
          window.history.pushState({}, "", `./`);
          console.log("Closing the collection");
        }
        if (collectionSlug === activeCollectionSlug) {
          router.replace(`/${teamSlug}/${workspaceSlug}`);
        }
        mutate({ collections: list }, { revalidate: false });
      });
    } catch (error) {
      console.error("error", error);
      toast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Delete item
  async function deleteItem(itemSlug: string, collectionSlug: string) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;
    const activeItemSlug = param?.item_slug;
    try {
      fetcher(
        `/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}/${itemSlug}`,
        {
          method: "DELETE",
        }
      ).then((data) => {
        toast({
          title: "Item deleted",
          description: "Item has been deleted successfully",
        });
        const list = collections.map((c) => {
          if (c.meta.slug === collectionSlug) {
            c.children = c.children.filter(
              (i: any) => i.meta.slug !== itemSlug
            );
          }
          return c;
        });
        if (itemSlug === activeItemSlug) {
          router.replace(`/${teamSlug}/${workspaceSlug}/${collectionSlug}`);
        }
        mutate({ collections: list }, { revalidate: false });
      });
    } catch (error) {
      console.error("error", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      throw error;
    }
  }

  return (
    <WorkspaceContext.Provider
      value={{
        error,
        loading,
        collections: collections,
        activeCollection,
        activeItem,
        UpdateActiveItem,
        createCollection,
        updateCollection,
        deleteCollection,
        deleteItem,
      }}>
      {children}
    </WorkspaceContext.Provider>
  );
}
