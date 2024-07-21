import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolTipWrapper } from "@/components/ui/tooltip";
import { CopyPlus, MoreVerticalIcon, PlusIcon } from "lucide-react";
import React from "react";

// import { WorkspaceContext } from "@/app/(dashboard)/[team_slug]/[workspace_slug]/providers";
import { Spinner } from "@/components/atom/spinner";
import { H5 } from "@/components/atom/typography";
import { UsageLimitView } from "@/components/molecule";
import { WorkspacePermissionView } from "@/components/molecule/workspace-permission-view";
import { ListView } from "@/components/ui/listview";
import { getNextPlan } from "@/lib/constants";
import useUsage from "@/lib/hooks/use-usage";
import useCollections from "@/lib/swr/use-collections";
import useTeam from "@/lib/swr/use-team";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import cx from "classnames";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NoCollectionView } from "./collection-board";

interface Props {}
/**
 * Display collections in list component
 */
export default function CollectionList(prop: Props) {
  const { error, loading, collections, mutate } = useCollections();
  return (
    <>
      <ListView
        className="flex flex-col gap-6 overflow-y-auto px-4 pb-28"
        items={collections}
        loading={loading}
        sortBy={(a: Collection, b: Collection) => a.sortIndex - b.sortIndex}
        renderItem={(collection, index) => (
          <RenderCollection key={index} collection={collection} />
        )}
        noItemsElement={<NoCollectionView />}
        placeholder={
          <div className="ml-1 flex  animate-pulse flex-col gap-4  border-l border-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cx(" -mx-px flex flex-col gap-2  py-1 pl-4 ")}
              >
                <div className="h-5 w-6/12 rounded bg-secondary-foreground/10 " />

                <div className="flex w-full flex-col gap-4 border-l-2 border-secondary pl-4">
                  <div className="h-4 w-6/12 rounded bg-secondary" />
                  <div className="h-4 w-4/12 rounded bg-secondary" />
                  <div className="h-4 w-8/12 rounded bg-secondary" />
                </div>
              </div>
            ))}
          </div>
        }
      />
    </>
  );
}
type Status = "IDLE" | "CREATING-ITEM" | "CREATING-COLLECTION" | "DELETING";
interface RenderCollectionProps {
  collection: Collection;
}
function RenderCollection({ collection }: RenderCollectionProps) {
  const [deleteStatus, setDeleteStatus] = React.useState<Status>("IDLE");
  const [createItemStatus, setCreateItemStatus] =
    React.useState<Status>("IDLE");
  const { createCollection, deleteCollection } = useCollections();
  const { limit, exceedingPageLimit } = useUsage();
  const { meta, plan } = useTeam();

  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
  };

  function HandleDeleteCollection() {
    setDeleteStatus("DELETING");
    deleteCollection(collection?._id, collection?.meta?.slug).finally(() => {
      setDeleteStatus("IDLE");
    });
  }

  function handleCreateItem(object = "item" as "item" | "collection") {
    setCreateItemStatus(("CREATING-" + object.toUpperCase()) as Status);
    createCollection({
      object: object,
      parent: collection._id,
    }).finally(() => {
      setCreateItemStatus("IDLE");
    });
  }

  return (
    <div className="">
      <div className="group relative">
        <Link
          href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}`}
          className="w-full"
        >
          <H5 className="line-clamp-1 py-1.5 ">
            {hasValue(collection.name)
              ? collection.name
              : "Untitled collection"}
          </H5>
        </Link>
        <WorkspacePermissionView permission="CREATE_CONTENT">
          <div className="invisible absolute -right-3 bottom-0 top-0 rounded text-muted-foreground group-hover:visible group-hover:bg-background">
            <div className="flex h-full items-center gap-2 px-1">
              <UsageLimitView
                exceedingLimit={exceedingPageLimit}
                upgradeMessage={`Current plan can have upto ${limit?.pages} pages in all workspaces. For higher pages quota upgrade to ${getNextPlan(plan)?.name} plan.`}
                plan={plan}
                team_slug={meta?.slug}
                placeholder={
                  <button className="cursor-not-allowed">
                    <PlusIcon size={15} />
                  </button>
                }
              >
                <button
                  onClick={() => {
                    handleCreateItem("item");
                  }}
                >
                  {createItemStatus === "CREATING-ITEM" ? (
                    <Spinner className="h-5" />
                  ) : (
                    <PlusIcon size={15} />
                  )}
                </button>
              </UsageLimitView>

              <ToolTipWrapper content={<span>Create Collection</span>}>
                <button
                  onClick={() => {
                    handleCreateItem("collection");
                  }}
                >
                  {createItemStatus === "CREATING-COLLECTION" ? (
                    <Spinner className="h-5" />
                  ) : (
                    <CopyPlus size={15} />
                  )}
                </button>
              </ToolTipWrapper>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 ">
                  <button>
                    {deleteStatus === "DELETING" ? (
                      <Spinner className="h-5" />
                    ) : (
                      <MoreVerticalIcon size={15} />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-border">
                  <DropdownMenuLabel>Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer rounded-sm text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    onClick={HandleDeleteCollection}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </WorkspacePermissionView>
      </div>

      <ListView
        items={collection.children}
        sortBy={(a: Collection, b: Collection) => a.sortIndex - b.sortIndex}
        className={cx(
          "ml-1 flex flex-col gap-2 border-l border-border transition-all  duration-150 ease-in-expo",
        )}
        renderItem={(item, index) => {
          if (item.object === "item") {
            return (
              <RenderItem key={index} item={item} collection={collection} />
            );
          }
          return (
            <div key={index} className="pl-4">
              <RenderCollection collection={item} />
            </div>
          );
        }}
        noItemsElement={
          <div className="-mx-px flex items-center gap-2  border-l border-border py-1  pl-4 text-sm font-medium text-muted-foreground/70">
            No pages
          </div>
        }
      />
    </div>
  );
}
interface RenderItemProps {
  item: Collection;
  collection: Collection;
}
function RenderItem({ item, collection }: RenderItemProps) {
  const [status, setStatus] = React.useState<Status>("IDLE");
  const { team_slug, workspace_slug, item_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
    item_slug?: string;
  };

  const { deleteItem } = useCollections();
  function HandleDeleteItem() {
    setStatus("DELETING");
    deleteItem(item._id, item?.meta?.slug, collection?.meta?.slug).finally(
      () => {
        setStatus("IDLE");
      },
    );
  }

  const isActive = item_slug === item?.meta?.slug;
  return (
    <div className="group relative">
      <Link
        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item.meta?.slug}/`}
        className={cx(
          "group -mx-px flex items-center gap-2  border-l py-1  pl-4 text-muted-foreground",
          {
            "border-primary text-primary": isActive,
            "hover:text border-border hover:border-secondary-foreground hover:text-secondary-foreground":
              !isActive,
          },
        )}
      >
        <span className="text-sm font-medium ">
          {hasValue(item.name) ? item.name : "Untitled page"}
        </span>
      </Link>
      <WorkspacePermissionView permission="DELETE_CONTENT">
        <div className="invisible absolute  -right-3 bottom-0 top-0 text-muted-foreground group-hover:visible group-hover:bg-background">
          <div className="flex h-full items-center gap-2 px-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 ">
                <button>
                  {status === "DELETING" ? (
                    <Spinner className="h-5" />
                  ) : (
                    <MoreVerticalIcon size={15} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-border">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-sm text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  onClick={HandleDeleteItem}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </WorkspacePermissionView>
    </div>
  );
}
