import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Label from "@/components/atom/label";
import { P } from "@/components/atom/typography";
import { ListView } from "@/components/ui/listview";
import useCollections from "@/lib/swr/use-collections";
import { hasValue } from "@/lib/utils";
import cx from "classnames";
import { useParams } from "next/dist/client/components/navigation";
import Link from "next/link";
import { LeftPanelSize } from "../workspace-view";

// import { NavLink, useLocation } from "react-router-dom";

interface CollectionBoardProps {
  workspace: any;
  createCollection: any;
  // allCollection: any;
  // isLoadingCollection: boolean;
  leftPanelSize: number;
  setLeftPanelSize?: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Display collection board
 */
export default function CollectionBoard({
  workspace,
  createCollection,
  // allCollection,
  // isLoadingCollection,
  leftPanelSize,
  setLeftPanelSize = (i) => {},
}: CollectionBoardProps) {
  // const [collections, setCollection] = useState<any>(allCollection ?? []);
  const { error, loading, collections, mutate } = useCollections();
  const [groups, setGroups] = useState<any>({});

  // path
  const slug = workspace?.meta?.slug;
  const pathArray = "/".split(slug);
  const relativePath = pathArray[0] + workspace.meta?.slug ?? "";

  // useEffect(() => {
  //   if (!allCollection) return;
  //   // Mock an API call.
  //   buildAndSave(allCollection);
  // }, [allCollection]);

  function buildAndSave(items: any) {}

  function onDragEnd(result: any) {
    const { destination, draggableId, source, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if ("group" === type) {
      const sourceIndex = source.index;
      const targetIndex = destination.index;

      const workValue = collections.slice();
      const [deletedItem] = workValue.splice(sourceIndex, 1);
      workValue.splice(targetIndex, 0, deletedItem);

      buildAndSave(workValue);

      return;
    }

    const sourceCollectionId = source.droppableId;
    const destinationCollectionId = destination.droppableId;

    const sourceDroppableIndex = groups[sourceCollectionId];
    const targetDroppableIndex = groups[destinationCollectionId];
    const sourceItems = collections[sourceDroppableIndex].children.slice();
    const targetItems =
      sourceCollectionId !== destinationCollectionId
        ? collections[targetDroppableIndex].children.slice()
        : sourceItems;

    // Pull the item from the source.
    const [deletedItem] = sourceItems.splice(source.index, 1);

    targetItems.splice(destination.index, 0, deletedItem);

    const workValue = collections.slice();
    // Update source collection column
    workValue[sourceDroppableIndex] = {
      ...collections[sourceDroppableIndex],
      children: sourceItems,
    };
    // Update source target collection column
    workValue[targetDroppableIndex] = {
      ...collections[targetDroppableIndex],
      children: targetItems,
    };
    const item = {
      id: draggableId,
      teamId: workspace.team,
      workspaceId: workspace._id,
      newParent: destinationCollectionId,
      index: destination.index,
      oldParent: sourceCollectionId,
    };
    // setCollection(workValue);
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="ROOT" type="group">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="RootDroppable flex h-full flex-row gap-4"
          >
            <ListView
              items={collections}
              className="CollectionRowsList flex h-full w-full gap-4  overflow-x-auto  px-2"
              renderItem={(collection, index) => (
                <Draggable
                  draggableId={collection._id}
                  key={collection._id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="CollectionDraggableColumn h-full rounded hover:bg-accent/30"
                    >
                      <CollectionColumn
                        key={collection._id}
                        collection={collection}
                        relativePath={relativePath}
                        setLeftPanelSize={setLeftPanelSize}
                      />
                    </div>
                  )}
                </Draggable>
              )}
              noItemsElement={<NoCollectionView />}
              placeholder={
                <>
                  <div className="flex1 flex h-full flex-col place-content-center items-center">
                    <Label variant="t2">Loading...</Label>
                  </div>
                </>
              }
            />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

/**
 *
 * @param {*} param0
 * @returns
 */
function CollectionColumn({
  collection,
  relativePath,
  setLeftPanelSize,
}: {
  collection: any;
  relativePath: any;
  setLeftPanelSize: any;
}) {
  const { team_slug, workspace_slug, item_slug } = useParams() as {
    team_slug?: string;
    workspace_slug?: string;
    collection_slug?: string;
    item_slug?: string;
  };
  return (
    <Droppable droppableId={collection._id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="CollectionColumn h-full  w-64 p-2"
        >
          <div className="w-76 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Label size="body" variant="t2">
              {collection.name}
            </Label>
          </div>

          <ListView
            items={collection.children}
            className="flex h-full flex-col   gap-2 overflow-hidden rounded p-2"
            renderItem={(item, index) => (
              <Draggable draggableId={item._id} index={index}>
                {(provided) => {
                  const isActive = item_slug === item.meta?.slug;
                  return (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className={cx(
                        "flex items-center rounded border border-border bg-card hover:shadow-sm ",
                        {
                          "bg-primary text-primary-foreground hover:bg-primary/90":
                            isActive,
                        },
                      )}
                    >
                      <Link
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-full p-2"
                        ref={provided.innerRef}
                        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item.meta?.slug}/`}
                        onClick={(e) => {
                          setLeftPanelSize(LeftPanelSize.large);
                        }}
                      >
                        <Label size="body">
                          {hasValue(item.name) ? item.name : "Untitled item"}
                        </Label>
                      </Link>
                    </div>
                  );
                }}
              </Draggable>
            )}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export function NoCollectionView() {
  return (
    <div className="flex flex-1 flex-col place-content-center items-center">
      <P>No items or collections</P>
      <P className="text-muted-foreground">Start by creating your first item</P>
    </div>
  );
}
