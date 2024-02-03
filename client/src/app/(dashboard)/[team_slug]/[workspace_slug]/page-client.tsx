"use client";

import Label from "@/components/atom/label";
import { LightbulbIcon } from "lucide-react";
import { WorkspaceContext } from "./providers";
import { hasValue } from "@/lib/utils";
import { useContext } from "react";

export default async function WorkspacePageClient() {
  const { error, loading,collections  } = useContext(WorkspaceContext);
  if(loading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div>Error: {error}</div>
  }
  if(!hasValue(collections)) {
    return <div>Nothing here to see</div>
  }
  return <div className="WorkspacePageClient" id="WorkspacePageClient">
     <div className="pt-56 flex-1 flex flex-col gap-10 items-center place-content-center h-full max-w-xl text-center mx-auto">
        <LightbulbIcon size={64} className="text-accent" />
        <span className="font-normal">
          Items are
          <Label variant="t2" className="mx-1 ">
            collaborative documents
          </Label>
          that help you capture knowledge. For example, a{" "}
          <Label variant="t2" className="mx-1 ">
            meeting note
          </Label>
          item could contain decisions made in a meeting. Items can be grouped
          and nested with collections.
        </span>
      </div>
  </div>
}
