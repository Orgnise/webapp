"use client";

import { useParams, useRouter } from "next/navigation";
import { ReactNode, createContext } from "react";

import { fetcher } from "@/lib/fetcher";
import useCollections from "@/lib/swr/use-collections";
import { Collection } from "@/lib/types/types";
import { toast } from "sonner";
export default function Providers({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}

interface WorkspaceProviderProps {
  updateCollection: (collection: Collection) => void;
  UpdateActiveItem: (item: Collection, parent: Collection) => Promise<void>;
  deleteCollection(collectionSlug: string): Promise<void>;
  deleteItem(itemSlug: string, collectionSlug: string): Promise<void>;
}

export const WorkspaceContext = createContext(
  null,
) as unknown as React.Context<WorkspaceProviderProps>;
WorkspaceContext.displayName = "WorkspaceContext";

function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { collections, mutate } = useCollections();
  // const { toast } = useToast();

  const param = useParams();
  const router = useRouter();

  // Set the active collection
  // useEffect(() => {
  //   if (!param?.collection_slug) {
  //     setActiveCollection(undefined);
  //     return;
  //   }
  //   const updatedCollection = collections?.find(
  //     (c) => c?.meta?.slug === param?.collection_slug
  //   );
  //   // Update the active collection if the collection slug has changed
  //   if (
  //     (updatedCollection &&
  //       (!activeCollection ||
  //         activeCollection?.meta?.slug !== param?.collection_slug)) ||
  //     updatedCollection?.children !== activeCollection?.children
  //   ) {
  //     setActiveCollection(updatedCollection);
  //   }
  // }, [param?.collection_slug, collections]);

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
        },
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
      // setActiveItem(response.item);

      if (activeItemSlug && activeItemSlug !== response.item?.meta?.slug) {
        router.replace(
          `/${teamSlug}/${workspaceSlug}/${collectionSlug}/${response?.item.meta.slug}`,
        );
      }

      mutate({ collections: list }, false);
    } catch (error) {
      console.error("error", error);
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
        },
      );
      const list = collections.map((c) => {
        if (c.meta.slug === collectionSlug) {
          return response.collection;
        }
        return c;
      });
      // Change the url if the collection slug has changed
      if (collectionSlug != response.collection.meta.slug) {
        router.replace(
          `/${teamSlug}/${workspaceSlug}/${response.collection.meta.slug}`,
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
        displayToast({
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
        mutate(
          { collections: list },
          { revalidate: false, optimisticData: list },
        );
      });
    } catch (error) {
      console.error("error", error);
      displayToast({
        title: "Error",
        description: "Failed to delete collection",
        variant: "error",
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
        },
      ).then((data) => {
        displayToast({
          title: "Item deleted - 1",
          description: "Item has been deleted successfully",
        });
        const list = collections.map((c) => {
          if (c.meta.slug === collectionSlug) {
            c.children = c.children.filter(
              (i: any) => i.meta.slug !== itemSlug,
            );
          }
          return c;
        });
        if (itemSlug === activeItemSlug) {
          router.replace(`/${teamSlug}/${workspaceSlug}/${collectionSlug}`);
        }
        mutate(
          { collections: list },
          {
            revalidate: false,
            optimisticData: list,
          },
        );
      });
    } catch (error) {
      console.error("error", error);
      displayToast({
        title: "Error",
        description: "Failed to delete item",
        variant: "error",
      });
      throw error;
    }
  }

  function displayToast({
    title,
    description,
    variant = "success",
  }: {
    title: string;
    description: string;
    variant?: "success" | "error";
  }) {
    const ele = (
      <div>
        <h1 className="font-medium">{title}</h1>
        <p>{description}</p>
      </div>
    );
    switch (variant) {
      case "success":
        toast.success(ele);
        break;
      case "error":
        toast.error(ele);
      default:
        break;
    }
  }

  return (
    <WorkspaceContext.Provider
      value={{
        UpdateActiveItem,
        updateCollection,
        deleteCollection,
        deleteItem,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
