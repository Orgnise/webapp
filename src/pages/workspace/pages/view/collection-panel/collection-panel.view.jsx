import React from "react";
import Tab from "../../../../../components/molecule/tab";
import SvgIcon from "../../../../../components/svg-icon/svg-icon";
import Label from "../../../../../components/typography";
import useWorkspace from "../../../hook/use-workspace.hook";
import { LeftPanelSize } from "../../../layout/workspace-content-view";
import CollectionBoard from "./collection-board";
import CollectionGraph from "./collection-graph";
import CollectionList from "./collection-list";
import CollectionTable from "./collection-table";

const PanelLayout = Object.freeze({
  list: "List",
  board: "Board",
  table: "Table",
  graph: "Graph",
});

export default function CollectionPanel({
  workspace,
  leftPanelSize,
  setLeftPanelSize = () => {},

  isLoadingCollection,
}) {
  if (!workspace) {
    return null;
  }
  const [activeLayout, setActiveLayout] = React.useState(PanelLayout.list);

  const { createCollection, createItem, allCollection, deleteCollection } =
    useWorkspace();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center bg-default shadow border-t theme-border">
        <Tab
          tab="List"
          selected={activeLayout === PanelLayout.list}
          onClick={() => {
            setLeftPanelSize(LeftPanelSize.default);
            setActiveLayout(PanelLayout.list);
          }}
        />
        <Tab
          tab="Board"
          selected={activeLayout === PanelLayout.board}
          onClick={() => {
            setActiveLayout(PanelLayout.board);
            setLeftPanelSize(LeftPanelSize.large);
          }}
        />
        <Tab
          tab="Table"
          selected={activeLayout === PanelLayout.table}
          onClick={() => {
            setActiveLayout(PanelLayout.table);
            setLeftPanelSize(LeftPanelSize.large);
          }}
        />
        <Tab
          tab="Graph"
          selected={activeLayout === PanelLayout.graph}
          onClick={() => {
            setActiveLayout(PanelLayout.graph);
            setLeftPanelSize(LeftPanelSize.large);
          }}
        />
      </div>
      <PanelTopToolbar />
      {activeLayout === PanelLayout.list && <CollectionList />}
      {activeLayout === PanelLayout.board && (
        <CollectionBoard
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          allCollection={allCollection}
          isLoadingCollection={isLoadingCollection}
        />
      )}
      {activeLayout === PanelLayout.table && (
        <CollectionTable
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          allCollection={allCollection}
          isLoadingCollection={isLoadingCollection}
        />
      )}
      {activeLayout === PanelLayout.graph && (
        <CollectionGraph
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          workspace={workspace}
          createCollection={createCollection}
          allCollection={allCollection}
          isLoadingCollection={isLoadingCollection}
        />
      )}
    </div>
  );

  function PanelTopToolbar() {
    return (
      <div
        className="flex items-center place-content-between
       p-2">
        <Label className="mx-1 uppercase" size="body" variant="s1">
          {workspace.name}
        </Label>

        <div className="flex items-center h-4">
          <SvgIcon
            icon="Plus"
            size={7}
            className="hover:bg-onSurface theme-text-primary rounded p-1 outline-1 cursor-pointer"
            onClick={() => {
              createCollection();
            }}
          />

          <SvgIcon
            size={7}
            icon={
              leftPanelSize === LeftPanelSize.max
                ? "DownLeftAndUpRight"
                : "UpRightAndDownLeft"
            }
            className="hover:bg-onSurface rounded p-1 outline-1 cursor-pointer"
            onClick={() => {
              if (leftPanelSize === LeftPanelSize.max) {
                setLeftPanelSize(LeftPanelSize.default);
              } else {
                setLeftPanelSize(LeftPanelSize.max);
              }
            }}
          />
          <SvgIcon
            icon="AngleLeft"
            size={7}
            className="hover:bg-onSurface rounded p-1 outline-1 cursor-pointer"
            onClick={() => {
              setLeftPanelSize(LeftPanelSize.min);
            }}
          />
        </div>
      </div>
    );
  }
}
