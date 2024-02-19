import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import useSWR, { KeyedMutator } from "swr";
import { fetcher } from "../fetcher";
import { Collection } from "../types/types";

interface IWorkspaces {
  error: any;
  mutate: KeyedMutator<any>;
  loading: boolean;
  collections: Collection[];
  /**
   * Create a new collection / Item
   * To create item, pass the parent collection slug
   */
  createCollection(collection: Collection): Promise<void>;
  updateCollection: (collection: Collection) => void;
  UpdateItem: (item: Collection, parent: Collection) => Promise<void>;
  deleteCollection(collectionSlug: string): Promise<void>;
  deleteItem(itemSlug: string, collectionSlug: string): Promise<void>;
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
      dedupingInterval: 30000,
    },
  );

  // Create a new Collection/Item
  async function createCollection(collection: Collection) {
    try {
      const response = await fetcher(
        `/api/teams/${team_slug}/${workspace_slug}/collections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collection: collection }),
        },
      );
      displayToast({
        title: "Success",
        description: response?.message,
      });
      const collections = data?.collections;
      if (collection.object === "collection") {
        const list = [...collections, response.collection];
        // setActiveCollection(response.collection);
        mutate({ collections: list }, { revalidate: false });
        console.log("Collection created[");
        router.push(
          `/${team_slug}/${workspace_slug}/${response.collection.meta.slug}`,
        );
      } else {
        const list = collections.map((c: any) => {
          if (c._id === collection.parent) {
            c.children.push(response.collection);
          }
          return c;
        });
        mutate(
          { collections: list },
          {
            optimisticData: list,
          },
        );
      }
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
      const list = data.collections.map((c: any) => {
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
      console.log("Active item updated", list);
      mutate(
        { collections: list },
        {
          revalidate: false,
          optimisticData: list,
        },
      );
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
      const list = data.collections.map((c: any) => {
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
        const list = data?.collections?.filter(
          (c: any) => c.meta?.slug !== collectionSlug,
        );
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

    fetcher(
      `/api/teams/${teamSlug}/${workspaceSlug}/${collectionSlug}/${itemSlug}`,
      {
        method: "DELETE",
      },
    )
      .then(() => {
        displayToast({
          title: "Item deleted - 1",
          description: "Item has been deleted successfully",
        });
        const list = data?.collections?.map((c: any) => {
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

function displayToast({
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
