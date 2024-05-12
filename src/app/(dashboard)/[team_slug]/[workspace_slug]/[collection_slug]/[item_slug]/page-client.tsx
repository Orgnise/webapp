"use client";

import { SmallLabel } from "@/components/atom/typography";
import NotFoundView from "@/components/team/team-not-found";
import ItemContent from "@/components/team/workspace/collection/content/content";
import { Input } from "@/components/ui/input";
import { checkWorkspacePermissions } from "@/lib/constants/workspace-role";
import useCollections from "@/lib/swr/use-collections";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { Collection } from "@/lib/types/types";
import { findInCollectionTree } from "@/lib/utility/collection-tree-structure";
import { hasValue } from "@/lib/utils";
import { PrinterIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Loading from "./loading";

export default function ItemPageClient() {
  const componentRef = useRef<HTMLDivElement>(null);

  const {
    collections,
    UpdateItem: UpdateActiveItem,
    error,
    loading,
  } = useCollections();

  const { activeWorkspace } = useWorkspaces();

  const content = useRef<any>(undefined);
  const { team_slug, workspace_slug, collection_slug, item_slug } =
    useParams() as {
      team_slug: string;
      workspace_slug: string;
      collection_slug: string;
      item_slug: string;
    };
  const activeCollection = useMemo(() => {
    if (!collections) return null;
    return findInCollectionTree(
      collections,
      (collection) => collection.meta.slug === collection_slug,
    ) as Collection;
  }, [collection_slug, collections]);

  const activeItem = useMemo(
    () =>
      activeCollection?.children?.find((c: any) => c?.meta?.slug === item_slug),
    [activeCollection, item_slug],
  );

  const onKeyDown = (e: any) => {
    if (e.metaKey && e.which === 83) {
      e.preventDefault();
      UpdateActiveItem(
        {
          ...activeItem!,
          content: content.current,
        },
        activeCollection!,
      );
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: activeItem?.name ?? "Document",
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, activeItem]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!hasValue(activeItem)) {
    return (
      <div className="ItemPageClient h-full w-full py-12">
        <NotFoundView item="Page" />
      </div>
    );
  }

  return (
    <div className="ItemPageClient h-full w-full py-12">
      <div className="flex h-full flex-col ">
        <div className="flex flex-col gap-6 bg-background pb-2">
          <Link
            href={`/${team_slug}/${workspace_slug}/${activeCollection?.meta?.slug}`}
          >
            <SmallLabel className="">{activeCollection?.name}</SmallLabel>
          </Link>
          <div className="flex place-content-between items-center gap-2">
            <CollectionNameField
              name={activeItem?.name}
              disabled={
                !checkWorkspacePermissions(
                  activeWorkspace?.role,
                  "EDIT_CONTENT",
                )
              }
              onUpdateName={(name: string) => {
                console.log("name", name);
                UpdateActiveItem(
                  { ...activeItem!, name: name },
                  activeCollection!,
                );
              }}
            />
            <button
              onClick={handlePrint}
              className="flex flex-shrink-0 items-center gap-2 text-sm text-muted-foreground"
            >
              <PrinterIcon size={18} />
              Print
            </button>
          </div>
        </div>
        <div
          ref={componentRef}
          className="z-0 flex h-full flex-grow flex-col overflow-y-auto"
        >
          <ItemContent
            activeItem={activeItem}
            editable={checkWorkspacePermissions(
              activeWorkspace?.role,
              "EDIT_CONTENT",
            )}
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
  disabled,
}: {
  name?: string;
  disabled?: boolean;
  onUpdateName: (name: string) => void;
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
        disabled={disabled}
        className=" border-none bg-transparent  text-2xl font-bold placeholder:text-2xl placeholder:text-muted-foreground placeholder:opacity-50 focus-visible:outline-none focus-visible:ring-0"
        maxLength={70}
        defaultValue={name}
        required
        name="name"
        placeholder="Untitled collection"
      />
    </form>
  );
}
