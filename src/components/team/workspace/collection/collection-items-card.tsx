"use Client";
// import { WorkspaceContext } from "@/app/(dashboard)/[team_slug]/[workspace_slug]/providers";
import { Spinner } from "@/components/atom/spinner";
import { H5 } from "@/components/atom/typography";
import { UsageLimitView } from "@/components/molecule";
import { WorkspacePermissionView } from "@/components/molecule/workspace-permission-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/ui/listview";
import useCollections from "@/lib/swr/use-collections";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import cx from "classnames";
import { CheckIcon, ChevronRight, Edit2Icon, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Status = "Idle" | "Saving" | "Deleting";

import { ToolTipWrapper } from "@/components/ui";
import { getNextPlan } from "@/lib/constants";
import useUsage from "@/lib/hooks/use-usage";
import useTeam from "@/lib/swr/use-team";
import { useState } from "react";
import { CreateItemCTA } from "./content/item/create-item-cta";
export function CollectionItemCard({
  index,
  item,
  collection,
}: {
  index: number;
  item: Collection;
  collection?: Collection;
}) {
  const [status, setStatus] = useState<Status>("Idle");
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
  };
  const { UpdateItem: UpdateItem, deleteItem } = useCollections();

  function handleUpdateName(e: any) {
    e.preventDefault();
    const name = e.target.name.value;
    setStatus("Saving");
    UpdateItem({ ...item!, name: name }, collection!)
      .then(() => {
        setIsEditEnabled(false);
      })
      .finally(() => {
        setStatus("Idle");
      });
  }

  async function handleDeleteItem() {
    console.log("Start delete", status);
    if (status === "Deleting") {
      return;
    }
    setStatus("Deleting");
    await deleteItem(item._id, item?.meta?.slug, collection?.meta?.slug!);
    setStatus("Idle");
  }

  if (isEditEnabled) {
    return (
      <div className="mb-1 flex items-center gap-2 pl-2">
        <ChevronRight
          className={cx("", {
            "text-muted-foreground": !hasValue(item.name),
          })}
          size={20}
        />
        <form
          onSubmit={handleUpdateName}
          className="gap - 2 -mx-1 flex flex-grow items-center rounded border border-border pr-2"
        >
          <Input
            placeholder="Untitled"
            autoFocus
            required
            maxLength={30}
            defaultValue={item?.name}
            name="name"
            type="text"
            className="h-auto flex-grow border-none "
          />

          <Button
            variant={"ghost"}
            className="inline-flex  h-7 w-7 cursor-pointer place-content-center items-center rounded bg-accent p-1 text-center focus-within:scale-90"
            onClick={() => {}}
          >
            {status === "Saving" ? (
              <Spinner className="h-5" />
            ) : (
              <CheckIcon size={14} />
            )}
          </Button>
        </form>
        <button
          className="inline-flex cursor-pointer place-content-center items-center rounded bg-accent p-1 text-center focus-within:scale-90"
          onClick={() => {
            setIsEditEnabled(false);
          }}
        >
          <X />
        </button>
      </div>
    );
  }
  if (item.object == "collection") {
    return <CollectionCard collection={item} />;
  }
  return (
    <div id={`Page-${index}`} className="group relative mb-1">
      <Link
        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item?.meta?.slug}`}
        className={cx(
          "flex cursor-pointer items-center gap-1 rounded p-2 group-hover:bg-accent ",
          {
            "text-muted-foreground": !hasValue(item.name),
          },
        )}
      >
        <ChevronRight className="pr-1" size={20} />

        {hasValue(item.name) ? (
          <div className="font-sans ">{item.name}</div>
        ) : (
          <div className="font-sans ">Untitled page</div>
        )}
      </Link>
      <WorkspacePermissionView permission="EDIT_CONTENT">
        <div
          className={cx(
            "absolute bottom-0 right-0 top-0 group-hover:visible ",
            {
              visible: status === "Deleting",
              invisible: status === "Idle",
            },
          )}
        >
          <div className="flex h-full place-content-center items-center gap-2 px-2">
            <Button
              variant={"ghost"}
              className="h-7 w-7 p-1 transition-all duration-75 focus-within:scale-90  hover:shadow group-hover:bg-accent-foreground/50"
              onClick={() => {
                if (status !== "Idle") {
                  return;
                }
                setIsEditEnabled(true);
              }}
            >
              <Edit2Icon size={14} className="text-destructive-foreground" />
            </Button>
            <Button
              variant={"destructive"}
              className="h-7 w-7 p-1 transition-all duration-75 focus-within:scale-90 hover:shadow"
              onClick={handleDeleteItem}
            >
              {status === "Deleting" ? (
                <Spinner className="h-5" />
              ) : (
                <Trash2 size={14} />
              )}
            </Button>
          </div>
        </div>
      </WorkspacePermissionView>
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  const { team_slug, workspace_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
  };
  const { limit, exceedingPageLimit } = useUsage();
  const { meta, plan } = useTeam();

  return (
    <div className="flex flex-col ">
      <div className="group flex place-content-between items-center gap-1 rounded border border-transparent pl-2 hover:border-border">
        <ChevronRight size={20} />
        <Link
          href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}`}
          className="w-full"
        >
          <H5 className="line-clamp-1 py-1 ">
            {hasValue(collection.name)
              ? collection.name
              : "Untitled collection"}
          </H5>
        </Link>
        <WorkspacePermissionView
          permission="CREATE_CONTENT"
          className="invisible group-hover:visible"
        >
          <UsageLimitView
            exceedingLimit={exceedingPageLimit}
            upgradeMessage={`Current plan can have upto ${limit?.pages} pages in all workspaces. For higher pages quota upgrade to ${getNextPlan(plan)?.name} plan.`}
            plan={plan}
            team_slug={meta?.slug}
            placeholder={
              <Button size={"icon"} variant={"link"}>
                Create Page
              </Button>
            }
          >
            <ToolTipWrapper content={"Create page"}>
              <Button
                className="m-0.5 h-7 w-7 focus-within:scale-90"
                variant={"ghost"}
                size={"icon"}
              >
                <CreateItemCTA activeCollection={collection!}>
                  &nbsp;
                </CreateItemCTA>
              </Button>
            </ToolTipWrapper>
          </UsageLimitView>
        </WorkspacePermissionView>
      </div>
      <ListView
        items={collection!.children}
        className="ml-4 flex  flex-col overflow-y-auto border-l border-border pl-4"
        renderItem={(item, index) => (
          <CollectionItemCard
            key={index}
            index={index}
            item={item}
            collection={collection}
          />
        )}
        footerElement={<div className="w-full"></div>}
        noItemsElement={
          <div className="pl-4 text-muted-foreground/40">
            <div className="flex items-center gap-1 border-l border-border pl-4 ">
              <p className="line-clamp-1 py-0.5 ">No pages</p>
            </div>
          </div>
        }
      />
    </div>
  );
}
