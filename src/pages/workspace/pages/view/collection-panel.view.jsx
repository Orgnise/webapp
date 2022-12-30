import React, { useEffect } from "react";
import cx from "classnames";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { NavLink, useLocation } from "react-router-dom";
import { ListView } from "../../../../components/compound/list-view";
import FIcon from "../../../../components/ficon";
import useWorkspace from "../../hook/use-workspace.hook";
import { LeftPanelSize } from "../../layout/workspace-content-view";
import Button from "../../../../components/atom/button";
import Accordion from "../../../../components/compound/accordion";
import Validator from "../../../../helper/validator";

export default function CollectionPanel({
  workspace,
  leftPanelSize,
  setLeftPanelSize,

  isLoadingCollection,
}) {
  if (!workspace) {
    return null;
  }

  const { createCollection, createItem, allCollection } = useWorkspace();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PanelTopToolbar />

      <ListView
        className="h-full overflow-y-auto"
        items={allCollection}
        loading={isLoadingCollection}
        renderItem={(collection, index) => (
          <RenderCollection
            workspace={workspace}
            collection={collection}
            createItem={createItem}
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
          <FIcon
            icon={solid("plus")}
            size="lg"
            className="hover:bg-gray-200 rounded p-2 outline-1 outline-gray-500 text-teal-500 cursor-pointer h-3 "
            onClick={() => {
              createCollection();
            }}
          />

          <FIcon
            icon={
              leftPanelSize === LeftPanelSize.max
                ? solid("down-left-and-up-right-to-center")
                : solid("up-right-and-down-left-from-center")
            }
            className="hover:bg-gray-200 rounded p-2  outline-1 outline-gray-500 text-gray-500 cursor-pointer h-3"
            onClick={() => {
              if (leftPanelSize === LeftPanelSize.max) {
                setLeftPanelSize(LeftPanelSize.default);
              } else {
                setLeftPanelSize(LeftPanelSize.max);
              }
            }}
          />
          <FIcon
            icon={solid("angles-left")}
            className={cx(
              "p-2  outline-1 outline-gray-700 text-gray-500 rounded cursor-pointer h-3",
              "hover:bg-gray-200"
            )}
            onClick={() => {
              setLeftPanelSize(LeftPanelSize.min);
            }}
          />
        </div>
      </div>
    );
  }
}

function RenderCollection({ workspace, collection, createItem }) {
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
              " group flex items-center space-x-2 px-2  py-3 text-sm font-medium",
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
          <div className="flex-1 text-sm font-sans text-gray-900">
            <span>
              <span>
                {collection.object === "collection" ? (
                  !active ? (
                    <FIcon icon={solid("angle-right")} className="pr-1" />
                  ) : (
                    <FIcon icon={solid("angle-down")} className=" pr-1" />
                  )
                ) : (
                  <div className="w-1 pr-1" />
                )}
              </span>
              <span>{collection.title}</span>
            </span>
          </div>

          <FIcon
            icon={solid("plus")}
            className="invisible group-hover:visible hover:bg-gray-200 rounded p-2 outline-1 outline-gray-500 text-teal-500 cursor-pointer h-3 "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createItem(collection);
            }}
          />
        </NavLink>
      }
    >
      <ListView
        items={collection.children}
        className="pl-3"
        renderItem={(item, index) => (
          <RenderItem item={item} index={index} relativePath={relativePath} />
        )}
      />
    </Accordion>
  );
}

function RenderItem({ item, index, relativePath }) {
  return (
    <NavLink
      key={index}
      to={`${relativePath}/${item.id}`}
      className={(data) =>
        cx(
          "group flex items-center space-x-2 px-2 py-3 text-sm font-medium ",
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
      <div className="flex-1 text-sm font-sans text-gray-900">
        <span>
          <span>
            {item.object === "collection" ? (
              <FIcon icon={solid("angle-right")} className="w-1 pr-1" />
            ) : (
              <div className="w-1 pr-1" />
            )}
          </span>
          <span>{item.title}</span>
        </span>
      </div>
    </NavLink>
  );
}
