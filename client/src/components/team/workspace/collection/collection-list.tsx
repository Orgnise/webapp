import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToolTipWrapper } from "@/components/ui/tooltip";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import React, { useContext } from "react";

import { WorkspaceContext } from "@/app/(dashboard)/[team_slug]/[workspace_slug]/providers";
import { Spinner } from "@/components/atom/spinner";
import { H5 } from "@/components/atom/typography";
import { ListView } from "@/components/ui/listview";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import cx from "classnames";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NoCollectionView } from "./collection-board";

interface Props {
  collections: Array<Collection>;
  isLoading?: boolean;
}
/**
 * Display collections in list component
 */
export default function CollectionList(prop: Props) {
  return (
    <ListView
      className="h-full overflow-y-auto flex flex-col gap-6 pb-28 px-4"
      items={prop.collections}
      loading={prop.isLoading}
      renderItem={(collection, index) => (
        <RenderCollection collection={collection} />
      )}
      noItemsElement={<NoCollectionView />}
      placeholder={
        <>
          <div className="flex flex-col gap-2">
            <div className="h-full w-full flex place-content-center items-center">
              <Spinner />
            </div>
          </div>
        </>
      }
    />
  );
}
type Status = "IDLE" | "LOADING";
interface RenderCollectionProps {
  collection: Collection;
}
function RenderCollection({ collection }: RenderCollectionProps) {
  const [deleteStatus, setDeleteStatus] = React.useState<Status>("IDLE");
  const [createItemStatus, setCreateItemStatus] =
    React.useState<Status>("IDLE");
  const { deleteCollection, createCollection } = useContext(WorkspaceContext);

  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
  };

  function HandleDeleteCollection() {
    setDeleteStatus("LOADING");
    deleteCollection(collection?.meta?.slug).finally(() => {
      setDeleteStatus("IDLE");
    });
  }

  function handleCreateItem() {
    setCreateItemStatus("LOADING");
    createCollection({
      object: "item",
      parent: collection._id,
    } as Collection).finally(() => {
      setDeleteStatus("IDLE");
    });
  }

  return (
    <div className="">
      <div className="group relative">
        <Link
          href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}`}
          className="w-full">
          <H5 className="line-clamp-1 py-1 ">
            {hasValue(collection.title) ? collection.title : "Untitled"}
          </H5>
        </Link>
        <div className="absolute -right-3  top-0 bottom-0 text-muted-foreground invisible group-hover:visible group-hover:bg-background">
          <div className="flex items-center gap-2 h-full px-1">
            <ToolTipWrapper onHover={<span>Create Item</span>}>
              <button onClick={handleCreateItem}>
                {createItemStatus === "LOADING" ? (
                  <Spinner />
                ) : (
                  <PlusIcon size={15} />
                )}
              </button>
            </ToolTipWrapper>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 ">
                <button>
                  {deleteStatus === "LOADING" ? (
                    <Spinner />
                  ) : (
                    <MoreVerticalIcon size={15} />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-border">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer rounded-sm"
                  onClick={HandleDeleteCollection}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ListView
        items={collection.children}
        className={cx(
          "transition-all duration-150 ease-in-expo mx-1 flex flex-col gap-2  border-l border-border"
        )}
        renderItem={(item, index) => (
          <RenderItem item={item} collection={collection} />
        )}
        noItemsElement={
          <div className="py-1 flex items-center gap-2  pl-4 border-l  text-muted-foreground/70 -mx-px text-sm font-medium">
            No items
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

  const { deleteItem } = useContext(WorkspaceContext);
  function HandleDeleteItem() {
    setStatus("LOADING");
    deleteItem(item?.meta?.slug, collection?.meta?.slug).finally(() => {
      setStatus("IDLE");
    });
  }

  const isActive = item_slug === item?.meta?.slug;
  return (
    <div className="group relative">
      <Link
        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item.meta?.slug}/`}
        className={cx(
          "group py-1 flex items-center gap-2  pl-4 border-l  text-muted-foreground -mx-px",
          {
            "text-primary border-primary": isActive,
            "border-border hover:border-accent hover:text hover:border-secondary-foreground hover:text-secondary-foreground":
              !isActive,
          }
        )}>
        <span className="text-sm font-medium ">
          {hasValue(item.name)
            ? item.name
            : hasValue(item.title)
            ? item.title
            : "Untitled"}
        </span>
      </Link>
      <div className="absolute -right-3  top-0 bottom-0 text-muted-foreground invisible group-hover:visible group-hover:bg-background">
        <div className="flex items-center gap-2 h-full px-1">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 ">
              <button>
                {status === "LOADING" ? (
                  <Spinner />
                ) : (
                  <MoreVerticalIcon size={15} />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-border">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer rounded-sm"
                onClick={HandleDeleteItem}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
