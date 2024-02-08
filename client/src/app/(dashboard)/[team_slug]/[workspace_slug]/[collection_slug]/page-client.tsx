"use client";

import { useContext, useState } from "react";

import { ChevronRight } from "lucide-react";
import { Collection } from "@/lib/types/types";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import Loading from "./loading";
import NotFoundView from "@/components/team/team-not-found";
import { WorkspaceContext } from "../providers";
import { hasValue } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { useParams } from "next/navigation";

export default async function CollectionContentPageClient() {
  const { activeCollection, loading, error, updateCollection } =
    useContext(WorkspaceContext);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!hasValue(activeCollection)) {
    return (
      <div className="CollectionContentPage h-full w-full py-12">
        <NotFoundView item="Collection" />
      </div>
    );
  }

  return (
    <div
      className="CollectionContentPage h-full  w-full"
      id="CollectionContentPage">
      <div className="flex flex-col  pt-20">
        <div className=" border-b border-border pb-2">
          <CollectionNameField
            name={activeCollection?.name}
            onUpdateName={(name: string) => {
              updateCollection({ ...activeCollection!, name });
            }}
          />
        </div>
        <ListView
          items={activeCollection!.children}
          className="flex flex-col gap-2 overflow-y-auto pb-28 pt-4"
          renderItem={(item) => (
            <Item item={item} collection={activeCollection} />
          )}
        />
      </div>
    </div>
  );
}

function Item({
  item,
  collection,
}: {
  item: Collection;
  collection?: Collection;
}) {
  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
  };
  return (
    <Link
      href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item?.meta?.slug}`}
      className="flex items-center gap-1 p-2 hover:bg-accent rounded cursor-pointer ">
      <ChevronRight className="pr-1" size={20} />
      <div className="font-sans ">{item.title}</div>
    </Link>
  );
}

function CollectionNameField({
  name,
  onUpdateName,
}: {
  name?: string;
  onUpdateName?: any;
}) {
  const debounced = useDebouncedCallback(
    // function
    (value) => {
      onUpdateName(value);
    },
    2000
  );

  return (
    <Input
      type="text"
      autoFocus
      className="border-none bg-transparent  text-2xl font-bold focus-visible:outline-none focus-visible:ring-0 placeholder:text-muted-foreground placeholder:opacity-50 placeholder:text-2xl"
      maxLength={30}
      defaultValue={name}
      placeholder="Untitled"
      onChange={(e) => debounced(e.target.value)}
    />
  );
}
