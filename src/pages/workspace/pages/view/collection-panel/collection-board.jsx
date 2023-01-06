import React, { useState, useEffect } from "react";
import cx from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { NavLink, useLocation } from "react-router-dom";
import { ListView } from "../../../../../components/compound/list-view";
import Label from "../../../../../components/typography";
import { LeftPanelSize } from "../../../layout/workspace-content-view";
import NoCollectionView from "./no-collection.view";

/**
 * Display collection board
 */
export default function CollectionBoard({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  setLeftPanelSize = (i) => {},
}) {
  const [collections, setCollection] = useState([]);
  const [groups, setGroups] = useState({});

  const slug = workspace?.meta?.slug;
  const pathArray = useLocation().pathname.split(slug);
  const relativePath = pathArray[0] + workspace.meta.slug;

  useEffect(() => {
    if (!allCollection) return;
    // Mock an API call.
    buildAndSave(allCollection);
  }, [allCollection]);

  function buildAndSave(items) {
    const groups = {};
    for (let i = 0; i < Object.keys(items).length; ++i) {
      const currentCollection = items[i];
      groups[currentCollection.id] = i;
    }

    // Set the data.
    setCollection(items);

    // Makes the groups searchable via their id.
    setGroups(groups);
  }

  function onDragEnd(result) {
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

    const targetCollectionId = source.droppableId;
    const destinationCollectionId = destination.droppableId;

    const sourceDroppableIndex = groups[targetCollectionId];
    const targetDroppableIndex = groups[destinationCollectionId];
    const sourceItems = collections[sourceDroppableIndex].children.slice();
    const targetItems =
      targetCollectionId !== destinationCollectionId
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

    setCollection(workValue);
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
              className="CollectionRowsList flex h-full overflow-x-auto  gap-4  mx-2"
              renderItem={(collection, index) => (
                <Draggable
                  draggableId={collection.id}
                  key={collection.id}
                  index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      className="CollectionDraggableColumn h-full">
                      <CollectionColumn
                        key={collection.id}
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
function CollectionColumn({ collection, relativePath, setLeftPanelSize }) {
  return (
    <Droppable droppableId={collection.id}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className=" CollectionColumn h-full  p-2 w-64">
          <div className="w-76 overflow-hidden overflow-ellipsis whitespace-nowrap">
            <Label size="body" variant="t2">
              {collection.title}
            </Label>
          </div>

          <ListView
            items={collection.children}
            className="hover:bg-default/60 rounded h-full overflow-hidden p-2"
            renderItem={(item, index) => (
              <Draggable draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <NavLink
                      to={`${relativePath}/${item.id}`}
                      onClick={(e) => {
                        setLeftPanelSize(LeftPanelSize.large);
                      }}
                      className={(data) =>
                        cx(
                          "group link py-3 hover:bg-onSurface  bg-card rounded mb-2",
                          {
                            "link-active bg-card": data.isActive,
                            "link-inactive": !data.isActive,
                          }
                        )
                      }>
                      <Label size="body">{item.title}</Label>
                    </NavLink>
                  </div>
                )}
              </Draggable>
            )}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
