"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContext, useState } from "react";

import { Collection } from "@/lib/types/types";
import { Editor } from "novel";
import { H1 } from "@/components/atom/typography";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import Loading from "./loading";
import NotFoundView from "@/components/team/team-not-found";
import { WorkspaceContext } from "../providers";
import { hasValue } from "@/lib/utils";
import { useParams } from "next/navigation";

export default async function CollectionContentPageClient() {

  const { activeCollection, loading, error, collections } = useContext(WorkspaceContext);

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!hasValue(activeCollection)) {
    return <div className="CollectionContentPage h-full w-full py-12">
      <NotFoundView item="Collection"/>
    </div>
  }
  


  return <div className="CollectionContentPage h-full  w-full" id="CollectionContentPage">
    <div className="flex flex-col  pt-20">
      <H1 className="border-b-2 border-border pb-2">{activeCollection?.title}</H1>
      <ListView
        items={activeCollection!.children}
        className="flex flex-col gap-2 overflow-y-auto pb-28 pt-4"
        renderItem={(item) => <Item item={item} collection={activeCollection} />}
      />
    </div>
  </div>
}

function Item({ item, collection }: { item: Collection, collection?: Collection }) {
  const { team_slug, workspace_slug } = useParams() as { team_slug?: string, workspace_slug?: string, collection_slug?: string };
  return (
    <Link
      href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item?.meta?.slug}`}
      className="flex items-center gap-1 p-2 hover:bg-accent rounded cursor-pointer ">
      <ChevronRight className="pr-1" size={20} />
      <div className="font-sans ">{item.title}</div>
    </Link>
  );
}