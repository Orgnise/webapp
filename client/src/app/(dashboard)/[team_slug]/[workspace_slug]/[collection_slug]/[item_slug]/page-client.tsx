"use client";

import { useContext, useRef } from "react";

import CollectionContent from "@/components/team/workspace/collection/content/content";
import Link from "next/link";
import Loading from "./loading";
import NotFoundView from "@/components/team/team-not-found";
import { SmallLabel } from "@/components/atom/typography";
import { WorkspaceContext } from "../../providers";
import { hasValue } from "@/lib/utils";
import { useParams } from "next/navigation";

export default async function CollectionContentPageClient() {

  const { activeCollection, loading, error, activeItem, UpdateActiveItem } = useContext(WorkspaceContext);
  const content = useRef<any>(undefined);
  const param = useParams();

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  if (!hasValue(activeItem)) {
    return <div className="CollectionContentPage h-full w-full py-12">
      <NotFoundView item="Item" />
    </div>
  }




  return <div className="CollectionContentPage h-full w-full py-12">
    <div className="flex flex-col h-full ">
      <div className="pb-2  bg-background flex flex-col gap-6 px-10">
        <Link
          href={`/${param?.team_slug}/${param?.workspace_slug}/${activeCollection?.meta?.slug}`}
        >
          <SmallLabel className="">{activeCollection?.title}</SmallLabel>
        </Link>

        <input
          onChange={() => { }}
          value={activeItem?.title}
          placeholder="Untitled Item"
          className="text-2xl font-bold text-text w-full bg-transparent outline-none"
        />
      </div>
      <div className="flex-grow flex flex-col h-full overflow-y-auto z-0">

        <CollectionContent
          activeItem={activeItem}
          isEditing={true}
          onDebouncedUpdate={(editor) => {
            if (editor) {
              content.current = editor.getJSON()
            }
          }} />
      </div>

    </div>
  </div>
}
