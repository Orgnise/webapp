import { ForceGraph2D } from "react-force-graph";
import React, { useEffect } from "react";
import cx from "classnames";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ListView } from "../../../../../components/compound/list-view";
import useWorkspace from "../../../hook/use-workspace.hook";
import { LeftPanelSize } from "../../../layout/workspace-content-view";
import Button from "../../../../../components/atom/button";
import Accordion from "../../../../../components/compound/accordion";
import Validator from "../../../../../helper/validator";
import CustomDropDown from "../../../../../components/custom_dropdown";
import SvgIcon from "../../../../../components/svg-icon/svg-icon";
import Tab from "../../../../../components/molecule/tab";
import NoCollectionView from "./no-collection.view";
import Label from "../../../../../components/typography";

export default function CollectionTable({
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

  if (!Validator.hasValue(allCollection)) {
    return <NoCollectionView />;
  }

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
  if (!Validator.hasValue(allItems)) {
    return <NoCollectionView />;
  }

  return (
    <div className="h-full px-2 overflow-y-auto">
      <section className="w-full  min-w-fit overflow-x-auto bg-default px-3 rounded mb-40">
        <div className="flex items-center select-none">
          <div className="w-7/12 px-1 font-semibold py-1">
            {
              <div className="flex items-center gap-2 text-slate-700 place-content-between px-1">
                <Label variant="t2">Title</Label>
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
            <Label variant="t2">Collection</Label>
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
          className="border divide-y theme-border "
          renderItem={(item, index) => (
            <div key={index}>
              <div className="flex items-center  divide-x theme-border w-full ">
                <div className="px-1 w-7/12  cursor-pointer py-1">
                  <NavLink
                    key={index}
                    to={`${relativePath}/${item.id}`}
                    className={(data) =>
                      cx("group link p-2", {
                        "link-active ": data.isActive,
                        "link-inactive ": !data.isActive,
                      })
                    }
                  >
                    <Label size="body">{item.title}</Label>
                  </NavLink>
                </div>
                <div className="w-5/12 flex p-1 ">
                  <NavLink
                    key={index}
                    to={`${relativePath}/${item.collection.id}`}
                    className={(data) =>
                      cx(
                        "group link p-2 w-full overflow-hidden text-ellipsis whitespace-nowrap",
                        {
                          "link-active  bg-surface": data.isActive,
                          "link-inactive ": !data.isActive,
                        }
                      )
                    }
                  >
                    <Label size="body">{item.collection.title}</Label>
                  </NavLink>
                </div>
              </div>
            </div>
          )}
          noItemsElement={
            <div className="flex-1 flex flex-col items-center place-content-center h-96">
              <Label variant="s1">No items or collections</Label>
              <Label variant="s2">Start by creating your first item</Label>
            </div>
          }
        />
      </section>
    </div>
  );
}
