import React from "react";
import cx from "classnames";
import { LoadingSpinner } from "../../../components/atom/spinner";
import { SlideModal } from "../../../components/molecule/slide-modal";
import { Fold } from "../../../helper/typescript-utils";
import CustomDropDown from "../../../components/custom_dropdown";
import FIcon from "../../../components/ficon";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { ListView } from "../../../components/compound/list-view";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../../../components/atom/button";
import useWorkspace from "../hook/use-workspace.hook";

export default function WorkspaceSidePanel({ setActive, active }) {
  const navigate = useNavigate();
  const { teamSlug, workspacesList, team } = useWorkspace();

  return (
    <SlideModal
      width="320px"
      setActive={setActive}
      active={active}
      align="left"
    >
      <Fold
        value={team}
        ifPresent={(team) => (
          <div className="Layout bg-white w-full h-full">
            {/* Workspace Settings and Toggle */}
            <div className="flex justify-between items-center p-4">
              <CustomDropDown
                className="z-10"
                button={
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 flex-1">
                    <span>{team.name}</span>
                    <FIcon icon={solid("angle-down")} />
                  </div>
                }
              >
                <div className="relative">
                  <div className="absolute -right-20 flex flex-col p-2 gap-[2px] rounded bg-white text-sm shadow-lg border">
                    <p className="text-slate-400 py-2 w-64 ">
                      My Awesome Workspace
                    </p>
                    <div className="flex flex-col gap-1">
                      <div className="px-2 py-3 rounded hover:bg-gray-100 cursor-pointer">
                        Team Settings
                      </div>
                      <div
                        className="px-2 py-3 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate("/team");
                        }}
                      >
                        Switch and manage workspaces
                      </div>
                    </div>
                  </div>
                </div>
              </CustomDropDown>

              {/* Close this panel */}
              <button onClick={() => setActive(false)}>
                <FIcon icon={solid("angles-left")} className="text-slate-500" />
              </button>
            </div>

            {/* CREATE WORKSPACE */}

            <div className="flex gap-2 px-3 items-center mt-3">
              <p className="flex-1 text-[13px] text-slate-400">WORKSPACES</p>
              <Button
                label="create Workspace"
                type="link"
                size="small"
                leadingIcon={
                  <FIcon icon={solid("plus")} className="text-teal-500" />
                }
              />
            </div>

            <Fold
              value={workspacesList}
              ifPresent={(list) => (
                <ListView
                  items={list}
                  renderItem={(workspace) => (
                    <NavLink
                      to={`/team/${teamSlug}/${workspace.meta.slug}`}
                      className={(data) =>
                        cx(
                          " group flex items-center space-x-2 px-2  lg:mx-2 py-3 text-sm font-medium rounded-md ",
                          "transition-all ease-in duration-200",
                          {
                            "bg-gray-100 text-slate-700 border-l-4 rounded-l border-red-500":
                              data.isActive,
                            "text-gray-600 hover:bg-gray-50 hover:text-gray-900":
                              !data.isActive,
                          }
                        )
                      }
                      onClick={() => {
                        setActive(false);
                      }}
                    >
                      <FIcon
                        icon={regular("circle")}
                        className="text-slate-500 scale-75 z-0"
                        size="1x"
                      />
                      <p className="text-sm font-medium text-gray-900">
                        {workspace.name}
                      </p>
                    </NavLink>
                  )}
                  noItemsElement={
                    <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <FIcon
                        icon={solid("folder")}
                        className="text-slate-500"
                      />
                      <p className="text-sm font-medium text-gray-900">
                        Create a workspace to get started
                      </p>
                    </div>
                  }
                />
              )}
              ifAbsent={() => (
                <div className="px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 ">
                  <span className="text-sm text-slate-600">
                    Create a workspace to get started
                  </span>
                </div>
              )}
            />
          </div>
        )}
        ifAbsent={() => (
          <div className=" px-3 py-2 bg-gray-100 hover:bg-gray-100  m-3 h-full flex flex-col items-center place-content-center">
            <LoadingSpinner />
          </div>
        )}
      />
    </SlideModal>
  );
}
