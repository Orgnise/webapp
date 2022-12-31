import { ForceGraph2D } from "react-force-graph";
import React, { useEffect } from "react";
import cx from "classnames";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ListView } from "../../../../components/compound/list-view";
import useWorkspace from "../../hook/use-workspace.hook";
import { LeftPanelSize } from "../../layout/workspace-content-view";
import Button from "../../../../components/atom/button";
import Accordion from "../../../../components/compound/accordion";
import Validator from "../../../../helper/validator";
import CustomDropDown from "../../../../components/custom_dropdown";
import SvgIcon from "../../../../components/svg-icon/svg-icon";
import Tab from "../../../../components/molecule/tab";

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
      <div className="flex items-center bg-white shadow border-t">
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
       p-2"
      >
        <p className="text-slate-500 mx-1 uppercase text-sm">
          {workspace.name}
        </p>

        <div className="flex items-center h-4">
          <SvgIcon
            icon="Plus"
            size={7}
            className="hover:bg-gray-200 rounded p-1  text-teal-500 cursor-pointer "
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
            className="hover:bg-gray-200 rounded p-1  outline-1  text-gray-700 cursor-pointer"
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
            className="hover:bg-gray-200 rounded p-1  outline-1  text-gray-700 cursor-pointer "
            onClick={() => {
              setLeftPanelSize(LeftPanelSize.min);
            }}
          />
        </div>
      </div>
    );
  }
}

function CollectionList({}) {
  const {
    workspace,
    createCollection,
    createItem,
    allCollection,
    deleteCollection,
    isLoadingCollection,
  } = useWorkspace();
  return (
    <ListView
      className="h-full overflow-y-auto pb-28"
      items={allCollection}
      loading={isLoadingCollection}
      renderItem={(collection, index) => (
        <RenderCollection
          workspace={workspace}
          collection={collection}
          createItem={createItem}
          deleteCollection={deleteCollection}
        />
      )}
      noItemsElement={
        <div className="flex-1 flex flex-col items-center place-content-center">
          <div className="text-slate-500">No items or collections</div>
          <div className="text-slate-400">
            Start by creating your first item
          </div>
          <Button
            label="Create Item"
            size="small"
            type="link"
            className="mt-2 "
            onClick={() => {
              createCollection();
            }}
          />
        </div>
      }
      placeholder={
        <>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Loading...</div>
          </div>
        </>
      }
    />
  );
}

function RenderCollection({
  workspace,
  collection,
  createItem,
  deleteCollection,
}) {
  const [active, setActive] = React.useState(true);
  const pathArray = useLocation().pathname.split(workspace.meta.slug);
  const relativePath = pathArray[0] + workspace.meta.slug;
  const activeId = pathArray.pop().replace("/", "");

  // Display active collection and its children
  useEffect(() => {
    if (Validator.hasValue(collection.children)) {
      const hasActiveChild = collection.children.find(
        (child) => child.id === activeId
      );

      if (hasActiveChild) {
        setActive(true);
      }
    }
  }, [activeId, collection]);
  return (
    <Accordion
      onStateChange={(state) => setActive(state)}
      isOpen={active}
      title={
        <NavLink
          to={`${relativePath}/${collection.id}`}
          // className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
          className={(data) =>
            cx(
              "group flex items-center space-x-2 px-2 py-2 text-sm font-medium border-l-4",
              "transition-all ease-in duration-200",
              {
                "bg-gray-100 text-slate-700  border-red-500": data.isActive,
                "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent":
                  !data.isActive,
              }
            )
          }
        >
          <div className="flex-1 text-sm font-sans text-gray-900">
            <span>
              {collection.object === "collection" ? (
                <SvgIcon
                  icon={!active ? "chevronRight" : "chevronDown"}
                  size={3}
                  className="text-slate-600 mr-1"
                />
              ) : (
                <span className="w-1 pr-1" />
              )}

              <span>{collection.title}</span>
            </span>
          </div>

          <SvgIcon
            icon="CirclePlus"
            size={7}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createItem(collection);
            }}
            className="invisible group-hover:visible hover:bg-gray-200 rounded p-1 outline-1 outline-gray-500 text-teal-500 cursor-pointer"
          />
        </NavLink>
      }
    >
      <ListView
        items={collection.children}
        className="pl-3 pr-1"
        renderItem={(item, index) => (
          <RenderItem
            item={item}
            index={index}
            relativePath={relativePath}
            deleteCollection={deleteCollection}
          />
        )}
      />
    </Accordion>
  );
}

function RenderItem({
  item,
  index,
  relativePath,
  deleteCollection = (i, p) => {},
}) {
  return (
    <NavLink
      key={index}
      to={`${relativePath}/${item.id}`}
      className={(data) =>
        cx(
          "group flex items-center space-x-2 px-2 py-3 text-sm font-medium",
          "transition-all ease-in duration-200",
          {
            "bg-gray-100 text-slate-700 border-l-4 border-red-500":
              data.isActive,
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
              !data.isActive,
          }
        )
      }
    >
      <div className="group flex-1 flex items-center place-content-between text-sm font-sans text-gray-900">
        <span>
          <span>
            {item.object === "collection" ? (
              <SvgIcon icon="chevronRight" size={3} />
            ) : (
              <div className="w-1 pr-1" />
            )}
          </span>
          <span>{item.title}</span>
        </span>
        <CustomDropDown
          button={<SvgIcon icon="VerticalEllipse" size={4} className="h-4" />}
          className="group-hover:visible invisible"
        >
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
              onClick={() => {
                deleteCollection(item.id, item.parent);
              }}
            >
              Delete
            </div>
          </div>
        </CustomDropDown>
      </div>
    </NavLink>
  );
}

function CollectionBoard({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  setLeftPanelSize = (i) => {},
}) {
  const slug = workspace?.meta?.slug;
  const pathArray = useLocation().pathname.split(slug);
  const relativePath = pathArray[0] + workspace.meta.slug;

  return (
    <div className=" h-full p-2">
      <ListView
        className="h-full overflow-x-auto flex gap-4  mx-2"
        items={allCollection}
        loading={isLoadingCollection}
        renderItem={(collection, index) => (
          <div className="CollectionColumn h-full hover:bg-gray-50 rounded p-2">
            <div className="w-56">{collection.title}</div>
            <ListView
              items={collection.children}
              className="w-56"
              renderItem={(item, index) => (
                <NavLink
                  to={`${relativePath}/${item.id}`}
                  onClick={(e) => {
                    setLeftPanelSize(LeftPanelSize.large);
                  }}
                  className={(data) =>
                    cx(
                      "group flex items-center text-sm font-medium w-full p-2 bg-white shadow rounded mt-2",
                      "transition-all ease-in duration-200",
                      {
                        " text-slate-700 border-l-4 border-red-500":
                          data.isActive,
                        "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                          !data.isActive,
                      }
                    )
                  }
                >
                  <div className=" rounded    cursor-pointer">{item.title}</div>
                </NavLink>
              )}
            />
          </div>
        )}
        noItemsElement={
          <div className="flex-1 flex flex-col items-center place-content-center">
            <div className="text-slate-500">No items or collections</div>
            <div className="text-slate-400">
              Start by creating your first item
            </div>
            <Button
              label="Create Item"
              size="small"
              type="link"
              className="mt-2 "
              onClick={() => {
                createCollection();
              }}
            />
          </div>
        }
        placeholder={
          <>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Loading...</div>
            </div>
          </>
        }
      />
    </div>
  );
}

function CollectionTable({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  setLeftPanelSize = (i) => {},
}) {
  const SortBy = Object.freeze({
    asc: "asc",
    desc: "desc",
  });
  const [sortBy, setSortBy] = React.useState(SortBy.asc);
  const [sortCollectionBy, setSortCollectionBy] = React.useState(SortBy.asc);

  const slug = workspace?.meta?.slug;
  const pathArray = useLocation().pathname.split(slug);
  const relativePath = pathArray[0] + workspace.meta.slug;
  const allItems =
    allCollection &&
    allCollection
      .sort((a, b) => {
        if (sortCollectionBy == SortBy.asc) {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      })
      .reduce((acc, collection) => {
        return [
          ...acc,
          ...collection.children.map((item) => ({ ...item, collection })),
        ];
      }, [])
      .sort((a, b) => {
        if (sortBy == SortBy.asc) {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      });

  return (
    <div className="h-full px-2 overflow-y-auto">
      <section className="w-full  min-w-fit overflow-x-auto bg-white px-3 rounded mb-40">
        <div className="flex items-center select-none">
          <div className="w-7/12 px-1 font-semibold py-1">
            {
              <div className="flex items-center gap-2 text-slate-700 place-content-between px-1">
                <div className="">Title</div>
                <SvgIcon
                  icon="Arrow"
                  size={4}
                  variant={sortBy == SortBy.asc ? "up" : "down"}
                  className="text-slate-400 cursor-pointer "
                  onClick={() => {
                    setSortBy(sortBy == SortBy.asc ? SortBy.desc : SortBy.asc);
                  }}
                />
              </div>
            }
          </div>

          <div className="flex items-center gap-2 text-slate-700 place-content-between w-5/12 px-1">
            <div className="">Collection</div>
            <SvgIcon
              icon="Arrow"
              size={4}
              variant={sortCollectionBy == SortBy.asc ? "up" : "down"}
              className="text-slate-400 cursor-pointer mx-2"
              onClick={() => {
                setSortCollectionBy(
                  sortCollectionBy == SortBy.asc ? SortBy.desc : SortBy.asc
                );
              }}
            />
          </div>
        </div>
        <ListView
          items={allItems}
          className="border divide-y divide-gray-200 "
          renderItem={(item, index) => (
            <NavLink
              key={index}
              to={`${relativePath}/${item.id}`}
              className={(data) =>
                cx(
                  "group flex items-center space-x-2 px-2 text-sm font-medium w-full ",
                  "transition-all ease-in duration-200",
                  {
                    "bg-gray-100 text-slate-700 border-l-4 border-red-500":
                      data.isActive,
                    "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                      !data.isActive,
                  }
                )
              }
            >
              <div className="flex items-center  divide-x w-full">
                <div className="p-2 w-7/12  cursor-pointer">{item.title}</div>
                <div className="p-2 w-5/12 flex">
                  <div className="bg-gray-100 rounded px-1">
                    {item.collection.title}
                  </div>
                </div>
              </div>
            </NavLink>
          )}
          noItemsElement={
            <div className="flex-1 flex flex-col items-center place-content-center">
              <div className="text-slate-500">No items or collections</div>
              <div className="text-slate-400">
                Start by creating your first item
              </div>
            </div>
          }
        />
      </section>
    </div>
  );
}

function CollectionGraph({
  workspace,
  createCollection,
  allCollection,
  isLoadingCollection,
  leftPanelSize,
  setLeftPanelSize = (i) => {},
}) {
  if (!allCollection) {
    return <div>loading</div>;
  }
  const slug = workspace?.meta?.slug;
  const pathArray = useLocation().pathname.split(slug);
  const relativePath = pathArray[0] + workspace.meta.slug;
  const currentItem = pathArray[1].split("/")[1];

  const allItems =
    allCollection &&
    allCollection.reduce((acc, collection) => {
      return [
        ...acc,
        ...collection.children.map((item) => ({ ...item, collection })),
        collection,
      ];
    }, []);

  const links = [],
    node = [];

  allItems.forEach((item, index) => {
    node.push({
      id: item.id,
      name: item.title,
      val: index + 2,
      size: 10 * index,
      color:
        currentItem == item.id ? "red" : item.parent ? "black" : "SlateBlue",
    });
    // Add item
    if (item.parent) {
      links.push({
        source: item.id,
        target: item.parent,
      });
    } else {
      // add collection
      links.push({
        source: item.id,
        target: "root",
      });
    }
  });

  // Add root node
  node.push({
    id: "root",
    name: workspace.name,
    val: 1,
    size: 0,
    color: "red",
  });

  const tree2 = {
    nodes: node,
    links: links,
  };

  if (!tree2) {
    return <div>loading</div>;
  }

  const fgRef = React.useRef();
  const navigate = useNavigate();

  const handleClick = React.useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 40;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      navigate(`${relativePath}/${node.id}`);
      fgRef.current.zoomToFit(1400);
      setLeftPanelSize(LeftPanelSize.large);
    },
    [fgRef]
  );
  return (
    <div
      style={{ width: `${leftPanelSize}px` }}
      className="items-center flex place-content-center"
    >
      <ForceGraph2D
        ref={fgRef}
        graphData={tree2}
        nodeColor={(node) => node.color}
        nodeRelSize={4}
        linkDirectionalParticles={3}
        linkDirectionalParticleWidth={1}
        linkDirectionalParticleSpeed={0.006}
        nodeLabel={(node) => node.name}
        warmupTicks={60}
        cooldownTicks={10}
        nodeAutoColorBy="group"
        nodeCanvasObject={(node, ctx, globalScale) => {
          // Draw node
          if (node.id === "root") {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val * 4, 0, 2 * Math.PI, false);
            ctx.fillStyle = node.color;
            ctx.fill();
          } else {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const backgroundDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 1.2
            ); // some padding

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fillRect(
              node.x - backgroundDimensions[0] / 2,
              node.y - backgroundDimensions[1] / 2,
              ...backgroundDimensions
            );

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = node.color;
            ctx.fillText(label, node.x, node.y);

            // Shadow
            ctx.shadowColor = "#DADADA7D";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 20;
            ctx.shadowOffsetY = 20;
          }
        }}
        onNodeClick={handleClick}
        onEngineStop={() => fgRef.current.zoomToFit(1400)}
      />
    </div>
  );
}
