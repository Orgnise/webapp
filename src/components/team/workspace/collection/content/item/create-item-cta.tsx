"use Client";
import { Spinner } from "@/components/atom/spinner";
import useCollections from "@/lib/swr/use-collections";
import { Collection } from "@/lib/types/types";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface CreateItemProps {
  activeCollection?: Collection;
  children: React.ReactNode;
}
export function CreateItemCTA({ activeCollection, children }: CreateItemProps) {
  const { createCollection } = useCollections();
  const param = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Create a new Collection/Item
  async function handleCreateCollection() {
    const item = {
      object: "item",
      parent: activeCollection?._id,
    } as Collection;

    setIsLoading(true);
    await createCollection(item);
    setIsLoading(false);
  }

  return (
    <div
      className="flex items-center"
      onClick={() => {
        if (!activeCollection || isLoading) {
          return;
        }
        handleCreateCollection();
      }}
    >
      {isLoading ? (
        <Spinner className="theme-text-primary h-5 w-5" />
      ) : (
        <PlusIcon size={18} />
      )}
      {children}
    </div>
  );
}
