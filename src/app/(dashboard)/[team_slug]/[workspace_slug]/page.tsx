"use client";
import { Spinner } from "@/components/atom/spinner";
import { Button } from "@/components/ui/button";
import useCollections from "@/lib/swr/use-collections";
import { Collection } from "@/lib/types/types";
import { Fold } from "@/lib/utils";
import { LightbulbIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function WorkspacePage() {
  const [status, setStatus] = useState<"IDLE" | "LOADING">("IDLE");
  const { createCollection, collections, loading } = useCollections();

  async function handleCreateCollection() {
    setStatus("LOADING");
    const col = {
      object: "collection",
    } as Collection;
    const response = await createCollection(col).finally(() => {
      setStatus("IDLE");
    });
  }
  return (
    <div className="WorkspacePage h-full w-full flex-grow bg-background">
      <div className="mx-auto flex h-full max-w-xl flex-1 flex-col place-content-center items-center gap-10 pt-56 text-center">
        <LightbulbIcon size={64} className="text-accent" />
        <span className="font-normal">
          <strong>Collections</strong> are a way to organize and group pages
          together. They provide a convenient way to <strong>categorize</strong>{" "}
          and manage related pages within your workspace. By creating
          collections, you can easily organize your work / docs and improve
          productivity.
        </span>
        <Fold
          value={collections}
          ifPresent={(value: Collection[]) => (
            <div className="text-base text-muted-foreground">
              Select a collection to view its pages
            </div>
          )}
          ifAbsent={() => (
            <Button
              variant={"default"}
              className="mt-2 "
              size={"sm"}
              onClick={handleCreateCollection}
            >
              {status === "LOADING" ? (
                <Spinner className="theme-text-primary h-6" />
              ) : (
                <PlusIcon size={18} />
              )}
              &nbsp; Create collection
            </Button>
          )}
        />
      </div>
    </div>
  );
}
