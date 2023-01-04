import cx from "classnames";
import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ListView } from "../../../../../components/compound/list-view";
import CustomDropDown from "../../../../../components/custom_dropdown";
import SvgIcon from "../../../../../components/svg-icon/svg-icon";
import Label from "../../../../../components/typography";
import Validator from "../../../../../helper/validator";
import useWorkspace from "../../../hook/use-workspace.hook";
import NoCollectionView from "./no-collection.view";

/**
 * Display collections in list component
 */
export default function CollectionList() {
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
      noItemsElement={<NoCollectionView />}
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
  const [isExpand, setIsExpand] = React.useState(true);
  const [active, setActive] = React.useState(false);

  const pathArray = useLocation().pathname.split(workspace.meta.slug);
  const relativePath = pathArray[0] + workspace.meta.slug;
  const activeId = pathArray.pop().replace("/", "");

  // Display active collection and its children
  useEffect(() => {
    if (Validator.hasValue(collection.children)) {
      let hasActiveChild = collection.children.find(
        (child) => child.id === activeId
      );
      if (!Validator.hasValue(hasActiveChild)) {
        hasActiveChild = collection.id === activeId;
      }

      if (hasActiveChild) {
        setActive(true);
      }
    }
  }, [activeId, collection]);
  return (
    <>
      <NavLink
        to={`${relativePath}/${collection.id}`}
        className={(data) =>
          cx("group link py-2", {
            "link-active": data.isActive,
            "link-inactive hover:bg-onSurface": !data.isActive,
          })
        }
        onClick={() => {
          if (!active) {
            setIsExpand(true);
            console.log("setIsExpand", active);
          } else {
            setIsExpand(!isExpand);
            console.log("active", active);
          }
          setActive(!active);
        }}
      >
        <div className="flex-1 max-w-[320]">
          <Label size="body" variant="t2">
            {collection.object === "collection" ? (
              <SvgIcon
                icon={!isExpand ? "chevronRight" : "chevronDown"}
                size={3}
                className=" mr-1"
              />
            ) : (
              <span className="w-1 pr-1" />
            )}

            {collection.title}
          </Label>
        </div>

        <SvgIcon
          icon="CirclePlus"
          size={7}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            createItem(collection);
          }}
          className="invisible group-hover:visible hover:bg-surface rounded p-1 outline-1  text-teal-500 cursor-pointer"
        />
      </NavLink>

      <ListView
        items={collection.children}
        className={cx("transition-all duration-150 ease-in-expo pl-5 pr-1", {
          "h-0 opacity-0 z-[-10] overflow-hidden": !isExpand,
          "h-auto opacity-100 z-0": isExpand,
        })}
        renderItem={(item, index) => (
          <RenderItem
            item={item}
            index={index}
            relativePath={relativePath}
            deleteCollection={deleteCollection}
          />
        )}
      />
    </>
  );
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
          cx("group link py-2", {
            "link-active ": data.isActive,
            "link-inactive hover:bg-onSurface": !data.isActive,
          })
        }
      >
        <div className="group flex-1 flex items-center place-content-between ">
          <span>
            <span>
              {item.object === "collection" ? (
                <SvgIcon icon="chevronRight" size={3} />
              ) : (
                <div className="w-1 pr-1" />
              )}
            </span>
            <Label size="body">{item.title}</Label>
          </span>
          <CustomDropDown
            button={<SvgIcon icon="VerticalEllipse" size={4} className="h-4" />}
            className="group-hover:visible invisible"
          >
            <div className="flex flex-col gap-2 border theme-border rounded">
              <div
                className="flex items-center gap-2 px-3 py-2 hover:on-default cursor-pointer transition-all ease-in duration-200"
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
}
