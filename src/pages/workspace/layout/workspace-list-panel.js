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
import Label from "../../../components/typography";
import SvgIcon from "../../../components/svg-icon/svg-icon";

export default function WorkspaceSidePanel({ setActive, active }) {
  const navigate = useNavigate();
  const { teamSlug, workspacesList, team } = useWorkspace();

  return (
    <SlideModal
      width="320px"
      setActive={setActive}
      active={active}
      align="left">
      <Fold
        value={team}
        ifPresent={(team) => (
          <div className="Layout bg-card w-full h-full">
            {/* Workspace Settings and Toggle */}
            <div className="flex justify-between items-center p-4">
              <CustomDropDown
                className="z-10"
                align="left-1"
                button={
                  <Label className="flex1 flex items-center gap-2">
                    <span>{team.name}</span>
                    <SvgIcon icon="chevronDown" size={5} />
                  </Label>
                }>
                <div className="Menu relative w-full">
                  <div className="absolute  flex flex-col p-2 gap-[2px] rounded bg-card text-sm shadow-lg theme-border border divide-y">
                    <p className=" py-2 w-64 ">My Awesome Workspace</p>
                    <div className="flex flex-col gap-1 pt-2">
                      <div className="px-2 py-3 rounded hover:bg-surface cursor-pointer">
                        Team Settings
                      </div>
                      <div
                        className="px-2 py-3 rounded hover:bg-surface cursor-pointer"
                        onClick={() => {
                          navigate("/team");
                        }}>
                        Switch and manage workspaces
                      </div>
                    </div>
                  </div>
                </div>
              </CustomDropDown>

              {/* Close this panel */}

              <SvgIcon
                icon="AngleLeft"
                onClick={() => setActive(false)}
                size={4}
                className="cursor-pointer"
              />
            </div>

            {/* CREATE WORKSPACE */}

            <div className="flex gap-2 px-3 items-center mt-3">
              <p className="flex-1 text-[13px]">WORKSPACES</p>
              <Button
                label="create Workspace"
                type="link"
                size="small"
                leadingIcon={<FIcon icon={solid("plus")} />}
                onClick={() => {
                  navigate(`/team/${teamSlug}/create-workspace`);
                }}
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
                        cx("group link py-3", {
                          "link-active": data.isActive,
                          "link-inactive": !data.isActive,
                        })
                      }
                      onClick={() => {
                        setActive(false);
                      }}>
                      <FIcon
                        icon={regular("circle")}
                        className="scale-75 z-0"
                        size="1x"
                      />
                      <p className="text-sm font-medium ">{workspace.name}</p>
                    </NavLink>
                  )}
                  noItemsElement={
                    <div className="px-3 py-2 bg-surface hover:bg-surface  m-3 ">
                      <Label size="body" variant="s1">
                        Create a workspace to get started
                      </Label>
                    </div>
                  }
                />
              )}
              ifAbsent={() => (
                <div className="px-3 py-2 bg-surface hover:bg-surface  m-3 ">
                  <Label size="body" variant="s1">
                    Create a workspace to get started
                  </Label>
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
