import React, { useMemo } from "react";

import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import { ListView } from "@/components/ui/listview";
import useCollections from "@/lib/swr/use-collections";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import cx from "classnames";
import { ArrowUpAZ } from "lucide-react";
import { useParams } from "next/dist/client/components/navigation";
import Link from "next/link";
import { NoCollectionView } from "./collection-board";

interface CollectionTableProps {
  workspace: any;
  createCollection: any;
  // collections: Collection[];
  // isLoadingCollection: boolean;
  leftPanelSize: number;
  setLeftPanelSize?: React.Dispatch<React.SetStateAction<number>>;
}

export default function CollectionTable({
  workspace,
  createCollection,
  // collections,
  // isLoadingCollection,
  setLeftPanelSize = (i) => {},
}: CollectionTableProps) {
  type SortBy = "asc" | "desc" | undefined;
  const [sortBy, setSortBy] = React.useState<SortBy>("asc");
  const [sortCollectionBy, setSortCollectionBy] = React.useState<SortBy>();
  const { error, loading, collections, mutate } = useCollections();

  const { team_slug, workspace_slug, collection_slug, item_slug } =
    useParams() as {
      team_slug?: string;
      workspace_slug?: string;
      collection_slug?: string;
      item_slug: string;
    };
  const allItems = useMemo(
    () =>
      collections
        ?.sort?.((a: Collection, b: Collection) => {
          if (!sortCollectionBy) {
            return 1;
          } else if (sortCollectionBy == "asc") {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        })
        .reduce((acc: any, collection: Collection) => {
          return [
            ...acc,
            ...collection.children.map((item: Collection) => ({
              ...item,
              collection,
            })),
          ];
        }, [])
        .sort((a: Collection, b: Collection) => {
          if (!sortBy) {
            return 1;
          } else if (sortBy == "asc") {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        }),
    [collections, sortBy, sortCollectionBy],
  );

  if (!hasValue(allItems)) {
    return <NoCollectionView />;
  }
  if (!hasValue(collections)) {
    return <NoCollectionView />;
  }

  return (
    <div className="h-full overflow-y-auto px-2">
      <section className="bg-default  mb-40 w-full min-w-fit overflow-x-auto rounded px-3">
        <div className="flex select-none items-center">
          <div className="w-7/12 px-1 py-1 font-semibold">
            {
              <div className="flex items-center gap-2  px-1">
                <Label variant="t2">Items</Label>
                <Button
                  variant={"ghost"}
                  className="h-6 w-6 p-1"
                  onClick={() => {
                    setSortBy(sortBy == "asc" ? "desc" : "asc");
                    setSortCollectionBy(undefined);
                  }}
                >
                  <ArrowUpAZ size={15} />
                </Button>
              </div>
            }
          </div>

          <div className="flex w-5/12 items-center  gap-2 px-1">
            <Label variant="t2">Collection</Label>
            <Button
              variant={"ghost"}
              className="h-6 w-6 p-1"
              onClick={() => {
                setSortCollectionBy(sortCollectionBy == "asc" ? "desc" : "asc");
                setSortBy(undefined);
              }}
            >
              <ArrowUpAZ size={15} />
            </Button>
          </div>
        </div>

        <ListView
          items={allItems}
          className="divide-y divide-border border border-border "
          renderItem={(item, index) => {
            return (
              <div key={index}>
                <div className="flex w-full  items-center divide-x divide-border  bg-background">
                  <Link
                    href={`/${team_slug}/${workspace_slug}/${item.collection?.meta?.slug}/${item.meta?.slug}/`}
                    className={cx(
                      "w-7/12  cursor-pointer  p-2 text-muted-foreground",
                      {
                        "border-l border-primary text-primary":
                          item_slug === item?.meta?.slug,
                        "hover:text-secondary-foreground hover:shadow-sm":
                          item_slug !== item?.meta?.slug,
                      },
                    )}
                  >
                    <Label size="body">
                      {hasValue(item.name) ? item.name : "Untitled page"}
                    </Label>
                  </Link>
                  <Link
                    key={index}
                    href={`/${team_slug}/${workspace_slug}/${item.collection?.meta?.slug}`}
                    className={cx(
                      "w-5/12 overflow-hidden text-ellipsis whitespace-nowrap p-2",
                      {
                        "border-l border-primary text-primary":
                          collection_slug === item.collection?.meta?.slug,
                        "hover:bg-accent hover:text-accent-foreground":
                          collection_slug !== item.collection?.meta?.slug,
                      },
                    )}
                  >
                    <Label size="body">
                      {hasValue(item.collection.name)
                        ? item.collection.name
                        : "Untitled collection"}
                    </Label>
                  </Link>
                </div>
              </div>
            );
          }}
          noItemsElement={
            <div className="flex h-96 flex-1 flex-col place-content-center items-center">
              <Label variant="s1">No pages or collections</Label>
              <Label variant="s2">Start by creating your first item</Label>
            </div>
          }
        />
      </section>
    </div>
  );
}
