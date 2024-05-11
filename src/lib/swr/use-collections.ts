import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../fetcher";
import { Collection } from "../types/types";
import {
  addInCollectionTree,
  removeFromCollectionTree,
  updateInCollectionTree,
} from "../utility/collection-tree-structure";
import { CreateCollectionSchema, UpdateCollectionSchema } from "../zod/schemas/collection";

interface IWorkspaces {
  error: any;
  mutate: KeyedMutator<any>;
  loading: boolean;
  collections: Collection[];
  /**
   * Create a new collection / Page
   * To create Page, pass the parent collection slug
   */
  createCollection(data: typeof CreateCollectionSchema._type): Promise<void>;
  updateCollection: (id: string, collection: typeof UpdateCollectionSchema._type) => void;
  UpdateItem: (item: Collection, parent: Collection) => Promise<void>;
  deleteCollection(id: string, collectionSlug: string): Promise<void>;
  deleteItem(
    id: string,
    itemSlug: string,
    collectionSlug: string,
  ): Promise<void>;
}
export default function useCollections(): IWorkspaces {
  const param = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    item_slug?: string;
    collection_slug?: string;
  };

  const { team_slug, workspace_slug } = param;
  const router = useRouter();
  const {
    data: data,
    error,
    mutate,
  } = useSWR<any>(
    `/api/teams/${team_slug}/${workspace_slug}/collections`,
    fetcher,
    {
      dedupingInterval: 120000,
    },
  );

  // Create a new Collection/Page
  async function createCollection(collection: typeof CreateCollectionSchema._type) {
    try {
      const response = await fetcher(
        `/api/teams/${team_slug}/${workspace_slug}/collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...collection }),
        },
      );

      const collections = (data?.collections ?? []) as Array<Collection>;
      let collectionTree;

      //  If created item is a collection type then
      if (collection.object === "collection") {
        collectionTree = addInCollectionTree(
          collections,
          collection?.parent,
          response.collection,
        );
        mutate(
          { collections: collectionTree },
          { revalidate: false, optimisticData: collectionTree },
        );
        router.push(
          `/${team_slug}/${workspace_slug}/${response.collection.meta.slug}`,
        );
      }
      // If created item is an item type
      else {
        collectionTree = addInCollectionTree(
          collections,
          collection.parent,
          response.collection,
        );
        mutate(
          { collections: collectionTree },
          { revalidate: false, optimisticData: collectionTree },
        );
      }
      displayToast({
        title: "Success",
        description: response?.message,
      });
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  // Update the active item in database
  async function UpdateItem(item: Collection, parent: Collection) {
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
      const collectionTree = updateInCollectionTree(
        data?.collections,
        item._id,
        response.item,
      );

      if (activeItemSlug && activeItemSlug !== response.item?.meta?.slug) {
        router.replace(
          `/${teamSlug}/${workspaceSlug}/${collectionSlug}/${response?.item.meta.slug}`,
        );
      }
      console.log("Active item updated", collectionTree);
      mutate(
        { collections: collectionTree },
        {
          revalidate: false,
          optimisticData: collectionTree,
        },
      );
    } catch (error) {
      console.error("error", error);
    }
  }

  // Update collection name
  async function updateCollection(id: string, collection: typeof UpdateCollectionSchema._type) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;
    const collectionSlug = param?.collection_slug;
    try {
      const response = await fetcher(
        `/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(collection),
        },
      );

      const collectionTree = updateInCollectionTree(
        data?.collections,
        id,
        response.collection,
      );
      // Change the url if the collection slug has changed
      if (collectionSlug != response.collection.meta.slug) {
        router.replace(
          `/${teamSlug}/${workspaceSlug}/${response.collection.meta.slug}`,
        );
      }
      mutate(
        { collections: collectionTree },
        { revalidate: false, optimisticData: collectionTree },
      );
    } catch (error) {
      console.error("error", error);
      throw error;
    }
  }

  // Delete collection
  async function deleteCollection(id: string, collectionSlug: string) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;
    const activeCollectionSlug = param?.collection_slug;
    try {
      fetcher(`/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}`, {
        method: "DELETE",
      }).then((res) => {
        displayToast({
          title: "Collection deleted",
          description: "Collection has been deleted successfully",
        });
        const list = removeFromCollectionTree(data?.collections, id);
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
  async function deleteItem(
    itemId: string,
    itemSlug: string,
    collectionSlug: string,
  ) {
    const teamSlug = param?.team_slug;
    const workspaceSlug = param?.workspace_slug;
    const activeItemSlug = param?.item_slug;

    fetcher(
      `/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}/${itemSlug}`,
      {
        method: "DELETE",
      },
    )
      .then(() => {
        displayToast({
          title: "Page deleted",
          description: "Page has been deleted successfully",
        });
        const collectionTree = removeFromCollectionTree(
          data?.collections,
          itemId,
        );
        if (itemSlug === activeItemSlug) {
          router.replace(`/${teamSlug}/${workspaceSlug}/${collectionSlug}`);
        }
        mutate(
          { collections: collectionTree },
          {
            revalidate: false,
            optimisticData: collectionTree,
          },
        );
      })
      .catch((error) => {
        console.error("error", error);
        displayToast({
          title: "Error",
          description: "Failed to delete item",
          variant: "error",
        });
        throw error;
      });
  }

  return {
    mutate,
    collections: data?.collections,
    error,
    loading: !data && !error ? true : false,
    createCollection,
    updateCollection,
    UpdateItem,
    deleteCollection,
    deleteItem,
  };
}

export function displayToast({
  title,
  description,
  variant = "success",
}: {
  title: string;
  description: string;
  variant?: "success" | "error";
}) {
  switch (variant) {
    case "success":
      let ele = React.createElement(
        "div",
        { className: "flex items-center" },
        React.createElement(
          "div",
          { className: "flex-shrink-0" },
          React.createElement(
            "svg",
            {
              className: "h-6 w-6 text-green-500",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
            },
            React.createElement("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M5 13l4 4L19 7",
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "ml-3" },
          React.createElement(
            "h1",
            { className: "font-medium text-green-800" },
            title,
          ),
          React.createElement(
            "p",
            { className: "mt-1 text-sm text-green-700" },
            description,
          ),
        ),
      );
      toast.success(ele);
      break;
    case "error":
      let errorEle = React.createElement(
        "div",
        { className: "flex items-center" },
        React.createElement(
          "div",
          { className: "flex-shrink-0" },
          React.createElement(
            "svg",
            {
              className: "h-6 w-6 text-red-500",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
            },
            React.createElement("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M6 18L18 6M6 6l12 12",
            }),
          ),
        ),
        React.createElement(
          "div",
          { className: "ml-3" },
          React.createElement(
            "h1",
            { className: "font-medium text-red-800" },
            title,
          ),
          React.createElement(
            "p",
            { className: "mt-1 text-sm text-red-700" },
            description,
          ),
        ),
      );
      toast.error(errorEle);
    default:
      break;
  }
}
