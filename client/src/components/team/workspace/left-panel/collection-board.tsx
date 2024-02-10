import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Label from "@/components/atom/label";
import { LeftPanelSize } from "../workspace-view";
import Link from "next/link";
import { ListView } from "@/components/ui/listview";
import cx from "classnames";
import { useParams } from "next/dist/client/components/navigation";

// import { NavLink, useLocation } from "react-router-dom";

interface CollectionBoardProps {
  workspace: any;
  createCollection: any;
  allCollection: any;
  isLoadingCollection: boolean;
  leftPanelSize: number;
  setLeftPanelSize?: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Display collection board
 */
export default function CollectionBoard({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  leftPanelSize,
  setLeftPanelSize = (i) => { },
}: CollectionBoardProps) {
  const [collections, setCollection] = useState<any>(allCollection ?? []);
  const [groups, setGroups] = useState<any>({});

  // path
  const slug = workspace?.meta?.slug;
  const pathArray = '/'.split(slug);
  const relativePath = pathArray[0] + workspace.meta?.slug ?? ""

  useEffect(() => {
    if (!allCollection) return;
    // Mock an API call.
    buildAndSave(allCollection);
  }, [allCollection]);

  function buildAndSave(items: any) {

  }

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
            className="RootDroppable flex flex-row gap-4 h-full">
            <ListView
              items={collections}
              className="CollectionRowsList flex w-full h-full overflow-x-auto  gap-4  px-2"
              renderItem={(collection, index) => (
                <Draggable
                  draggableId={collection._id}
                  key={collection._id}
                  index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="CollectionDraggableColumn h-full rounded hover:bg-accent/30">
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
                  <div className="flex1 flex flex-col items-center place-content-center h-full">
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
function CollectionColumn({ collection, relativePath, setLeftPanelSize }: {
  collection: any;
  relativePath: any;
  setLeftPanelSize: any;
}) {
  return (
    <Droppable droppableId={collection._id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="CollectionColumn h-full  p-2 w-64">
          <div className="w-76 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Label size="body" variant="t2">
              {collection.title}
            </Label>
          </div>

          <ListView
            items={collection.children}
            className="flex flex-col gap-2   rounded h-full overflow-hidden p-2"
            renderItem={(item, index) => (
              <Draggable draggableId={item._id} index={index}>
                {(provided) => {
                  const { team_slug, workspace_slug, item_slug } = useParams() as { team_slug?: string, workspace_slug?: string, collection_slug?: string, item_slug?: string };

                  const isActive = item_slug === item.meta?.slug;
                  return (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className={cx('flex items-center bg-card shadow-sm rounded border border-border ', {
                        'bg-primary text-primary-foreground': isActive,
                        'hover:bg-accent': !isActive
                      })}
                    >
                      <Link
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 w-full"
                        ref={provided.innerRef}
                        href={`/${team_slug}/${workspace_slug}/${collection?.meta?.slug}/${item.meta?.slug}/`}
                        onClick={(e) => {
                          setLeftPanelSize(LeftPanelSize.large);
                        }}
                      >
                        <Label size="body">{item.title}</Label>
                      </Link>
                    </div>
                  )
                }

                }
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
    <div className="flex-1 flex flex-col items-center place-content-center">
      <Label variant="s1">No items or collections</Label>
      <Label variant="s2">Start by creating your first item</Label>
      <Button
        variant={"link"}
        className="mt-2 "
        onClick={() => {

        }}
      >
        Create Item
      </Button>
    </div>
  );
}
