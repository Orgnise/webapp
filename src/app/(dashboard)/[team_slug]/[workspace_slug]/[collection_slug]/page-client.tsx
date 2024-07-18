"use client";

import { UsageLimitView } from "@/components/molecule";
import { WorkspacePermissionView } from "@/components/molecule/workspace-permission-view";
import NotFoundView from "@/components/team/team-not-found";
import { CollectionItemCard } from "@/components/team/workspace/collection/collection-items-card";
import { CreateItemCTA } from "@/components/team/workspace/collection/content/item/create-item-cta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/ui/listview";
import { useToast } from "@/components/ui/use-toast";
import { getNextPlan } from "@/lib/constants";
import { checkWorkspacePermissions } from "@/lib/constants/workspace-role";
import useUsage from "@/lib/hooks/use-usage";
import useCollections from "@/lib/swr/use-collections";
import useTeam from "@/lib/swr/use-team";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { Collection } from "@/lib/types/types";
import { LightbulbIcon } from "lucide-react";
import Loading from "./loading";

export default function CollectionContentPageClient() {
  const { collections, loading, error, updateCollection, activeCollection } =
    useCollections();
  const { activeWorkspace } = useWorkspaces();
  const { limit, exceedingPageLimit } = useUsage();
  const { meta, plan } = useTeam();
  const { toast } = useToast();

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className="flex h-full  w-full flex-col place-content-center items-center py-12">
        <div className="text-sm text-muted-foreground">
          Something went wrong
        </div>
        <Button
          variant={"outline"}
          size={"sm"}
          className="my-4 text-sm"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh
        </Button>
      </div>
    );
  }
  if (!activeCollection) {
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
            disabled={
              !checkWorkspacePermissions(activeWorkspace?.role, "EDIT_CONTENT")
            }
            onUpdateName={(name: string) => {
              updateCollection(activeCollection!._id, { name }).then(
                (isUpdated) => {
                  if (isUpdated) {
                    toast({
                      title: "Success!",
                      description: "Collection name updated successfully",
                    });
                  }
                },
              );
            }}
          />
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
          footerElement={
            activeCollection!.children.length > 0 && (
              <WorkspacePermissionView permission="CREATE_CONTENT">
                <UsageLimitView
                  exceedingLimit={exceedingPageLimit}
                  upgradeMessage={`Current plan can have upto ${limit?.pages} pages in all workspaces. For higher pages quota upgrade to ${getNextPlan(plan)?.name} plan.`}
                  plan={plan}
                  team_slug={meta?.slug}
                  placeholder={
                    <Button size={"sm"} variant={"subtle"}>
                      Create Page
                    </Button>
                  }
                >
                  <Button
                    className="my-4 w-full border border-dashed p-4"
                    variant={"ghost"}
                  >
                    <CreateItemCTA activeCollection={activeCollection!}>
                      &nbsp; Create Page
                    </CreateItemCTA>
                  </Button>
                </UsageLimitView>
              </WorkspacePermissionView>
            )
          }
          noItemsElement={<NoItemsView activeCollection={activeCollection} />}
        />
      </div>
    </div>
  );
}

function NoItemsView({ activeCollection }: { activeCollection?: Collection }) {
  const { limit, exceedingPageLimit } = useUsage();
  const { meta, plan } = useTeam();
  return (
    <div className="NoItemsView h-full w-full flex-grow bg-background">
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
        <WorkspacePermissionView permission="CREATE_CONTENT">
          <UsageLimitView
            exceedingLimit={exceedingPageLimit}
            upgradeMessage={`Current plan can have upto ${limit?.pages} pages in all workspaces. For higher pages quota upgrade to ${getNextPlan(plan)?.name} plan.`}
            plan={plan}
            team_slug={meta?.slug}
            placeholder={
              <Button size={"sm"} variant={"subtle"}>
                Create Page
              </Button>
            }
          >
            <Button
              variant={"default"}
              className="border-dotted  border-muted-foreground "
              size={"sm"}
            >
              <CreateItemCTA activeCollection={activeCollection!}>
                &nbsp; Create Page
              </CreateItemCTA>
            </Button>
          </UsageLimitView>
        </WorkspacePermissionView>
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
  onUpdateName?: any;
  disabled?: boolean;
}) {
  return (
    <form
      className="group mr-4 flex flex-grow items-center rounded   border-transparent focus-within:border-border"
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
        className="flex-grow border-none bg-transparent  text-2xl font-bold placeholder:text-2xl placeholder:text-muted-foreground placeholder:opacity-50 focus-visible:outline-none focus-visible:ring-0"
        maxLength={32}
        defaultValue={name}
        required
        name="name"
        placeholder="Untitled collection"
      />
      <Button
        type="submit"
        size={"sm"}
        className="invisible mr-2 h-auto px-2 py-0.5 text-sm group-focus-within:visible"
      >
        Save
      </Button>
    </form>
  );
}
