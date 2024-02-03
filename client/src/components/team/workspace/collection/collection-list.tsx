import React, { useContext } from "react";

import { Collection } from "@/lib/types/types";
import { H5 } from "@/components/atom/typography";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import { NoCollectionView } from "./collection-board";
import { Spinner } from "@/components/atom/spinner";
import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import cx from "classnames";
import { useParams } from "next/navigation";

interface Props {
  collections: Array<Collection>;
  isLoading?: boolean;
}
/**
 * Display collections in list component
 */
export default function CollectionList(prop: Props) {

  const { workspacesData: { error, loading, workspaces, activeWorkspace } } = useContext(TeamContext);

  return (
    <ListView
      className="h-full overflow-y-auto flex flex-col gap-6 pb-28 px-4"
      items={prop.collections}
      loading={prop.isLoading}
      renderItem={(collection, index) => (
        <RenderCollection
          collection={collection}
        />
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

interface RenderCollectionProps {
  collection: Collection;
}
function RenderCollection({
  collection,
}: RenderCollectionProps) {
  const [isExpand, setIsExpand] = React.useState(true);

  const { team_slug, workspace_slug, collection_slug } = useParams() as { team_slug?: string, workspace_slug?: string, collection_slug?: string };
  const active = collection?.meta?.slug === collection_slug;

  return (
    <div className="">
      <Link
        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}`}
        className="w-full"
        onClick={(e => {
          e.stopPropagation();
          setIsExpand(true);
        })}>
        <H5 className="">
          {collection.title}
        </H5>
      </Link>

      <ListView
        items={collection.children}
        className={cx("transition-all duration-150 ease-in-expo mx-1 flex flex-col gap-2 pt-3 border-l border-border", {
          "h-0 opacity-0 z-[-10] overflow-hidden": !isExpand,
          "h-auto opacity-100 z-0": isExpand,
        })}
        renderItem={(item, index) => (
          <RenderItem
            item={item}
            index={index}
            collection={collection}
          />
        )}
      />
    </div>
  );

  interface RenderItemProps {
    item: any;
    index: number;
    collection: Collection;
  }

  function RenderItem({
    item,
    index,
  }: RenderItemProps) {
    const { team_slug, workspace_slug, item_slug } = useParams() as { team_slug?: string, workspace_slug?: string, collection_slug?: string, item_slug?: string };
    
    
    const isActive = item_slug === item.meta?.slug;
    return (
      <Link
        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item.meta?.slug}/`}
        className={cx("group link py-1 flex items-center gap-2  pl-4 border-l  text-muted-foreground -mx-px", {
          "text-primary border-primary": isActive,
          "border-border hover:border-accent hover:text hover:border-secondary-foreground hover:text-secondary-foreground": !isActive
        })}
      >
        <span className="text-sm font-medium ">{item.title}</span>
      </Link>
    );
  }
}
