import React, { useMemo } from "react";

import { ArrowUpAZ } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collection } from "@/lib/types/types";
import Label from "@/components/atom/label";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import { NoCollectionView } from "./collection-board";
import cx from "classnames";
import { hasValue } from "@/lib/utils";
import { useParams } from "next/dist/client/components/navigation";

interface CollectionTableProps {
  workspace: any;
  createCollection: any;
  allCollection: Collection[];
  isLoadingCollection: boolean;
  leftPanelSize: number;
  setLeftPanelSize?: React.Dispatch<React.SetStateAction<number>>;
}


export default function CollectionTable({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  setLeftPanelSize = (i) => { },
}: CollectionTableProps) {
  type SortBy = "asc" | "desc";
  const [sortBy, setSortBy] = React.useState<SortBy>('asc');
  const [sortCollectionBy, setSortCollectionBy] = React.useState<SortBy>('asc');

  if (!hasValue(allCollection)) {
    return <NoCollectionView />;
  }

  const { team_slug, workspace_slug, collection_slug, item_slug } = useParams() as { team_slug?: string, workspace_slug?: string, collection_slug?: string, item_slug: string };
  const allItems =
    allCollection &&
    useMemo(() => allCollection
      .sort((a: Collection, b: Collection) => {
        if (sortCollectionBy == 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      })
      .reduce((acc: any, collection: Collection) => {
        return [
          ...acc,
          ...collection.children.map((item: Collection) => ({ ...item, collection })),
        ];
      }, [])
      .sort((a: Collection, b: Collection) => {
        if (sortBy == 'asc') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      }),[allCollection,sortBy,sortCollectionBy]);

  if (!hasValue(allItems)) {
    return <NoCollectionView />;
  }

  return (
    <div className="h-full px-2 overflow-y-auto">
      <section className="w-full  min-w-fit overflow-x-auto bg-default px-3 rounded mb-40">
        <div className="flex items-center select-none">
          <div className="w-7/12 px-1 font-semibold py-1">
            {
              <div className="flex items-center gap-2  px-1">
                <Label variant="t2">Items</Label>
                <Button variant={'ghost'} className="h-6 w-6 p-1" onClick={() => {
                  setSortBy(sortBy == 'asc' ? 'desc' : 'asc');
                }}>
                  <ArrowUpAZ size={15} />
                </Button>
              </div>
            }
          </div>

          <div className="flex items-center gap-2  w-5/12 px-1">
            <Label variant="t2">Collection</Label>
            <Button variant={'ghost'} className="h-6 w-6 p-1" onClick={() => {
              setSortCollectionBy(
                sortCollectionBy == 'asc' ?'desc' :'asc'
              );
            }}>
              <ArrowUpAZ size={15} />
            </Button>
          </div>
        </div>

        <ListView
          items={allItems}
          className="border border-border divide-y divide-border "
          renderItem={(item, index) => {
            return (<div key={index}>
              <div className="flex items-center  divide-x divide-border w-full ">
                <Link
                  key={index}
                  href={`/${team_slug}/${workspace_slug}/${item.collection?.meta?.slug}/${item.meta?.slug}/`}
                  className={cx('p-2  w-7/12  cursor-pointer', {
                    'text-primary border-l  border-primary bg-secondary': item_slug === item?.meta?.slug,
                    'hover:bg-accent hover:text-accent-foreground': item_slug !== item?.meta?.slug,
                  })}
                >
                  <Label size="body">{item.title}</Label>
                </Link>
                <Link
                  key={index}
                  href={`/${team_slug}/${workspace_slug}/${item.collection?.meta?.slug}`}
                  className={cx("w-5/12 p-2 overflow-hidden text-ellipsis whitespace-nowrap", {
                    'text-primary border-l border-primary bg-secondary': collection_slug === item.collection?.meta?.slug,
                    'hover:bg-accent hover:text-accent-foreground': collection_slug !== item.collection?.meta?.slug,
                  })}
                >
                  <Label size="body">{item.collection.title}</Label>
                </Link>
              </div>

            </div>)
          }}
          noItemsElement={
            <div className="flex-1 flex flex-col items-center place-content-center h-96">
              <Label variant="s1">No items or collections</Label>
              <Label variant="s2">Start by creating your first item</Label>
            </div>
          }
        />
      </section>
    </div>
  );
}
