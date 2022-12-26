import React, { useEffect, useState } from "react";
import cx from "classnames";
import Validator from "../../../helper/validator";
import { LoaderIcon } from "react-hot-toast";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppService } from "../../../hooks/use-app-service";
import useSearchPath from "../../../hooks/use-search-path-hook";
import WorkspaceContentView, {
  LeftPanelSize,
} from "../layout/workspace-content-view";
import FIcon from "../../../components/ficon";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { ListView } from "../../../components/compound/list-view";
import Button from "../../../components/atom/button";
import useWorkspace from "../hook/use-workspace.hook";
import { Fold } from "../../../helper/typescript-utils";
import CustomDropDown from "../../../components/custom_dropdown";
import { VerticalEllipse } from "../../../components/svg-icon/verticle-ellipse";
import Accordion from "../../../components/compound/accordion";

/**
 * Displays the workspace view
 */
export default function WorkspaceView() {
  const [isLoading, setIsLoading] = useState();

  const [leftPanelSize, setLeftPanelSize] = useState(LeftPanelSize.default);

  const { isLoadingCollection, workspace } = useWorkspace();

  if (isLoading) {
    return (
      <div className="h-full w-full flex place-content-center items-center">
        <LoaderIcon />
      </div>
    );
  }

  return (
    <WorkspaceContentView
      content={<CollectionContent />}
      leftPanelState={leftPanelSize}
      onLeftPanelStateChange={setLeftPanelSize}
      leftPanel={
        <CollectionPanel
          workspace={workspace}
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          isLoadingCollection={isLoadingCollection}
        />
      }
    />
  );
}

function CollectionPanel({
  workspace,
  leftPanelSize,
  setLeftPanelSize,

  isLoadingCollection,
}) {
  if (!workspace) {
    return null;
  }

  const { createCollection, createItem, allCollection } = useWorkspace();

  const path = useLocation().pathname;
  const relativePath = path.split(workspace.meta.slug)[0] + workspace.meta.slug;

  return (
    <div className="flex flex-col h-full overflow-hidden">
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
      <div className="flex flex-col gap-6 h-full overflow-y-auto">
        <div className="flex-1 flex flex-col gap-4 py-4">
          <ListView
            items={allCollection}
            loading={isLoadingCollection}
            renderItem={(collection, index) => {
              return (
                <div>
                  <NavLink
                    to={`${relativePath}/${collection.id}`}
                    // className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
                    className={(data) =>
                      cx(
                        " group flex items-center space-x-2 px-2  lg:mx-2 py-3 text-sm font-medium",
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
                            <FIcon
                              icon={solid("angle-right")}
                              className="w-1 pr-1"
                            />
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
                  {collection.children && (
                    <div className="flex flex-col gap-2">
                      {collection.children.map((child, index) => {
                        return (
                          <NavLink
                            key={index}
                            to={`${relativePath}/${child.id}`}
                            className={(data) =>
                              cx(
                                "group flex items-center space-x-2 px-2 lg:mx-2 py-3 text-sm font-medium ml-4",
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
                                  {child.object === "collection" ? (
                                    <FIcon
                                      icon={solid("angle-right")}
                                      className="w-1 pr-1"
                                    />
                                  ) : (
                                    <div className="w-1 pr-1" />
                                  )}
                                </span>
                                <span>{child.title}</span>
                              </span>
                            </div>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }}
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
      </div>
    </div>
  );
}

function CollectionContent() {
  const [collection, setCollection] = useState();
  const [item, setItem] = useState();
  const {
    createCollection,
    deleteCollection,
    updateCollection,
    allCollection,
  } = useWorkspace();
  const activeCollection = useLocation().pathname.split("/").pop();

  useEffect(() => {
    if (!Validator.hasValue(allCollection)) {
      return;
    }
    const col = allCollection.find(
      (collection) => collection.id === activeCollection
    );

    let item;

    // if collection is not found, check if it is a child item
    if (col === undefined) {
      for (let i = 0; i < allCollection.length; i++) {
        if (Validator.hasValue(allCollection[i].children)) {
          item = allCollection[i].children.find(
            (item) => item.id === activeCollection
          );
          if (item !== undefined) {
            break;
          }
        }
      }
    }
    if (item) {
      setItem(item);
      setCollection();
    } else if (col) {
      setItem();
      setCollection(col);
    } else {
      setItem();
      setCollection();
    }
  }, [activeCollection, allCollection]);

  if (!Validator.hasValue(allCollection)) {
    return (
      <div className="flex-1 flex flex-col items-center place-content-center h-full max-w-xl text-center">
        <span className="font-normal">
          Items are{" "}
          <span className="font-semibold">collaborative documents</span> that
          help you capture knowledge. For example, a <span>meeting note</span>{" "}
          item could contain decisions made in a meeting. Items can be grouped
          and nested with collections.
        </span>
        <Button
          label="Create Item"
          size="small"
          type="outline"
          className="mt-2 "
          onClick={() => {
            createCollection();
          }}
        />
      </div>
    );
  }

  if (!collection && !item) {
    return (
      <div className="flex flex-col items-center place-content-center h-full py-8">
        <div className="font-semibold text-xs text-slate-700">
          Nothing is selected
        </div>
        <div className="font-semibold text-xs text-slate-400">
          Select and item or collection from the left panel
        </div>
      </div>
    );
  }
  return (
    <>
      {collection && <CollectionPage collection={collection} />}
      {item && <ItemPage item={item} />}
    </>
  );
}

function CollectionPage({ collection }) {
  const [title, setTitle] = useState("");
  const { workspace, createCollection, deleteCollection, updateCollection } =
    useWorkspace();

  const path = useLocation().pathname;
  const relativePath = path.split(workspace.meta.slug)[0] + workspace.meta.slug;

  useEffect(() => {
    if (Validator.hasValue(collection)) {
      setTitle(collection.title);
    }
  }, [collection]);

  function handleSubmit(e) {
    e.preventDefault();
    updateCollection(collection.id, title);
  }

  return (
    <div className="flex flex-col gap-8 h-full  py-10">
      <div className="flex items-center place-content-between">
        <FIcon icon={regular("copy")} className="pr-1" />
        <CustomDropDown
          button={
            <div className="h-4">
              <VerticalEllipse />
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
              onClick={() => {
                deleteCollection(collection.id);
              }}
            >
              Delete
            </div>
          </div>
        </CustomDropDown>
      </div>
      <div className="font-semibold text-4xl">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full bg-transparent"
          />
        </form>
      </div>
      <div className="flex flex-col gap-4">
        <ListView
          items={collection.children}
          renderItem={(item) => {
            return (
              <Link
                to={`${relativePath}/${item.id}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <FIcon icon={solid("angle-right")} className="pr-1" />
                <div className="font-sans">{item.title}</div>
              </Link>
            );
          }}
        />
      </div>
    </div>
  );
}

function ItemPage({ item }) {
  const [title, setTitle] = useState("");
  const { deleteCollection, updateCollection } = useWorkspace();

  useEffect(() => {
    if (Validator.hasValue(item)) {
      setTitle(item.title);
    }
  }, [item]);

  function handleSubmit(e) {
    e.preventDefault();
    updateCollection(item.id, title);
  }

  return (
    <div className="flex flex-col gap-8 h-full  py-10">
      <div className="flex items-center place-content-between">
        <FIcon icon={regular("copy")} className="pr-1" />
        <CustomDropDown
          button={
            <div className="h-4">
              <VerticalEllipse />
            </div>
          }
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
      <div className="font-semibold text-4xl">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full bg-transparent"
          />
        </form>
      </div>
      <div className="p-2">{item.content}</div>
    </div>
  );
}
