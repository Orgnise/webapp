"use client";

import CollectionContent from "@/components/team/workspace/collection/content/content";
import { H1 } from "@/components/atom/typography";
import Loading from "./loading";
import { WorkspaceContext } from "../../providers";
import { hasValue } from "@/lib/utils";
import { useContext } from "react";

export default async function CollectionContentPageClient() {

  const { activeCollection, loading, error, activeItem } = useContext(WorkspaceContext);

  if (loading) {
    return <Loading/>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!hasValue(activeItem)) {
    return <div>activeItem not found</div>
  }



  return <div className="CollectionContentPage h-full w-full pt-20" id="CollectionContentPage">
    <div className="flex flex-col  ">
      <H1 className="border-b-2 border-border pb-2">{activeCollection?.title}</H1>
      <CollectionContent activeItem={activeItem}/>
    </div>
  </div>
}
