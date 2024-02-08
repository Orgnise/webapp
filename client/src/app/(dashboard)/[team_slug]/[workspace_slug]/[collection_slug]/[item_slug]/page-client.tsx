"use client";

import { useContext, useEffect, useRef } from "react";

import { SmallLabel } from "@/components/atom/typography";
import NotFoundView from "@/components/team/team-not-found";
import CollectionContent from "@/components/team/workspace/collection/content/content";
import { Input } from "@/components/ui/input";
import { hasValue } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { WorkspaceContext } from "../../providers";
import Loading from "./loading";

export default async function CollectionContentPageClient() {
  const { activeCollection, loading, error, activeItem, UpdateActiveItem } =
    useContext(WorkspaceContext);
  const content = useRef<any>(undefined);
  const param = useParams();

  const onKeyDown = (e: any) => {
    if (e.metaKey && e.which === 83) {
      e.preventDefault();
      UpdateActiveItem({
        ...activeItem!,
        content: content.current,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [content, activeItem?._id]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!hasValue(activeItem)) {
    return (
      <div className="CollectionContentPage h-full w-full py-12">
        <NotFoundView item="Item" />
      </div>
    );
  }

  return (
    <div className="CollectionContentPage h-full w-full py-12">
      <div className="flex flex-col h-full ">
        <div className="pb-2  bg-background flex flex-col gap-6 px-10">
          <Link
            href={`/${param?.team_slug}/${param?.workspace_slug}/${activeCollection?.meta?.slug}`}>
            <SmallLabel className="">{activeCollection?.title}</SmallLabel>
          </Link>

          <CollectionNameField
            name={activeItem?.name}
            onUpdateName={(name: string) => {
              UpdateActiveItem({ ...activeItem!, name: name });
            }}
          />
        </div>
        <div className="flex-grow flex flex-col h-full overflow-y-auto z-0">
          <CollectionContent
            activeItem={activeItem}
            isEditing={true}
            onDebouncedUpdate={(editor) => {
              if (editor) {
                content.current = editor.getJSON();
              }
            }}
          />
        </div>
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
