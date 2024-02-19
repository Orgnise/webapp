"use client";

import NotFoundView from "@/components/team/team-not-found";
import { CollectionItemCard } from "@/components/team/workspace/collection/collection-items-card";
import { CreateItemCTA } from "@/components/team/workspace/collection/content/item/create-item-cta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/ui/listview";
import useCollections from "@/lib/swr/use-collections";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import { LightbulbIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Loading from "./loading";

export default async function CollectionContentPageClient() {
  const { collections, loading, error, updateCollection } = useCollections();
  const param = useParams();
  const activeCollection = useMemo(
    () => collections?.find((c) => c?.meta?.slug === param?.collection_slug),
    [collections, param],
  );

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className="CollectionContentPageClient h-full w-full py-12">
        Something went wrong
      </div>
    );
  }
  if (!hasValue(activeCollection)) {
    return (
      <div className="CollectionContentPageClient h-full w-full py-12">
        <NotFoundView item="Collection" />
      </div>
    );
  }

  return (
    <div className="CollectionContentPageClient h-full w-full flex-grow ">
      <div className="flex flex-col pt-20">
        <div className="flex place-content-between items-center border-b border-border pb-2">
          <CollectionNameField
            name={activeCollection?.name}
            onUpdateName={(name: string) => {
              updateCollection({ ...activeCollection!, name });
            }}
          />
          {activeCollection?.children?.length > 0 && (
            <Button
              variant={"default"}
              className="border-dotted  border-muted-foreground "
              size={"sm"}
            >
              <CreateItemCTA activeCollection={activeCollection!}>
                &nbsp; Create Item
              </CreateItemCTA>
            </Button>
          )}
        </div>
        <ListView
          items={activeCollection!.children}
          className="flex flex-col  overflow-y-auto pb-28 pt-4"
          renderItem={(item, index) => (
            <CollectionItemCard
              key={index}
              index={index}
              item={item}
              collection={activeCollection}
            />
          )}
          footerElement={<div className="w-full"></div>}
          noItemsElement={<NoItemsView activeCollection={activeCollection} />}
        />
      </div>
    </div>
  );
}

function NoItemsView({ activeCollection }: { activeCollection?: Collection }) {
  return (
    <div className="WorkspacePage h-full w-full flex-grow bg-background">
      <div className="mx-auto flex h-full max-w-xl flex-1 flex-col place-content-center items-center gap-10 pt-56 text-center">
        <LightbulbIcon size={64} className="text-accent" />
        <span className="font-normal">
          Items are
          <strong className="mx-1 ">collaborative documents</strong>
          that help you capture knowledge. For example, a{" "}
          <strong className="mx-1 ">meeting note</strong>
          item could contain decisions made in a meeting. Items are grouped
          inside <strong>collections</strong>.
        </span>
        <Button
          variant={"default"}
          className="border-dotted  border-muted-foreground "
          size={"sm"}
        >
          <CreateItemCTA activeCollection={activeCollection!}>
            &nbsp; Create Item
          </CreateItemCTA>
        </Button>
      </div>
    </div>
  );
}

function CollectionNameField({
  name,
  onUpdateName,
}: {
  name?: string;
  onUpdateName?: any;
}) {
  return (
    <form
      className="flex-grow"
      onSubmit={(e: any) => {
        e.preventDefault();
        const value = e.target.name.value;
        if (name !== value) {
          onUpdateName(value);
        }
      }}
    >
      <Input
        type="text"
        autoFocus
        className="border-none bg-transparent  text-2xl font-bold placeholder:text-2xl placeholder:text-muted-foreground placeholder:opacity-50 focus-visible:outline-none focus-visible:ring-0"
        maxLength={30}
        defaultValue={name}
        required
        name="name"
        placeholder="Untitled collection"
      />
    </form>
  );
}

interface CreateItemProps {
  activeCollection?: Collection;
  children: React.ReactNode;
  status: "IDLE" | "LOADING";
  onStatusUpdate: (status: "IDLE" | "LOADING") => void;
}
// function CreateItem({
//   activeCollection,
//   children,
//   onStatusUpdate,
//   status,
// }: CreateItemProps) {
//   // const { createCollection } = useContext(WorkspaceContext);

//   async function handleCreateCollection() {
//     onStatusUpdate("LOADING");
//     // createCollection({
//     //   object: "item",
//     //   parent: activeCollection?._id,
//     // } as Collection).finally(() => {
//     //   onStatusUpdate("IDLE");
//     // });
//   }
//   return (
//     <div
//       onClick={() => {
//         if (!activeCollection) {
//           return;
//         }
//         handleCreateCollection();
//       }}>
//       {children}
//     </div>
//   );
// }
