"use client";

import cx from "classnames";
import { PanelRightClose } from "lucide-react";
import { ValueOf } from "next/dist/shared/lib/constants";
import React from "react";
import { LeftPanelSize } from "./workspace-view";

interface IWorkspaceContentViewProps {
  leftPanel?: React.ReactNode;
  children?: React.ReactNode;
  leftPanelSize: ValueOf<typeof LeftPanelSize>;
  setLeftPanelSize: React.Dispatch<React.SetStateAction<number>>;
}

function WorkspaceContentView({
  leftPanel,
  children,
  leftPanelSize = LeftPanelSize.default,
  setLeftPanelSize,
}: IWorkspaceContentViewProps) {
  return (
    <div className="WorkspaceContent h-full transition-all duration-300">
      <div className=" bottom-0  left-0  right-0 h-full w-full overflow-y-auto ">
        <LeftPanel leftPanelSize={leftPanelSize}>{leftPanel}</LeftPanel>
        <Divider
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
        />
        <div
          className={cx(
            "top-84  fixed cursor-pointer",
            "z-0 transition-all delay-200 duration-300 ease-in-expo ",
            {
              "hidden opacity-0": leftPanelSize > LeftPanelSize.min,
              "block opacity-100": leftPanelSize < LeftPanelSize.min,
            },
          )}
        >
          <PanelRightClose
            size={24}
            onClick={() => setLeftPanelSize(LeftPanelSize.default)}
            className={cx(
              "m-2 cursor-pointer rounded p-1 outline-1 hover:bg-muted",
            )}
          />
        </div>
        <Content leftPanelSize={leftPanelSize}>{children}</Content>
      </div>
    </div>
  );
}

interface IDividerProps {
  leftPanelSize: number;
  setLeftPanelSize: (size: number) => void;
}
function Divider({ leftPanelSize, setLeftPanelSize }: IDividerProps) {
  return (
    <div
      draggable={true}
      onDrag={(e) => {
        if (e.clientX < LeftPanelSize.min) return;
        setLeftPanelSize(e.clientX);
      }}
      onDragEnd={(e) => {
        if (e.clientX < LeftPanelSize.min) return;
        setLeftPanelSize(e.clientX);
      }}
      style={{
        left: `${leftPanelSize}px`,
      }}
      className={cx(
        "Divider absolute z-10  h-[calc(100%-63px)] w-2 cursor-col-resize ",
        "transition-all duration-300 ease-in-expo",
        `left-[${leftPanelSize}px]`,
      )}
    />
  );
}

interface ILeftPanelProps {
  leftPanelSize: number;
  children: React.ReactNode;
}
function LeftPanel({ leftPanelSize, children }: ILeftPanelProps) {
  return (
    <div
      style={{
        width: `${leftPanelSize}px`,
      }}
      className={cx(
        `fixed top-[64px] h-full border-r border-border `,
        "left-0 transition-all duration-300 ease-in-expo",
      )}
    >
      {children}
    </div>
  );
}

interface IContentProps {
  leftPanelSize: number;
  children: React.ReactNode;
}
function Content({ leftPanelSize, children }: IContentProps) {
  return (
    <div
      style={{
        width: `calc(100% - ${leftPanelSize}px)`,
        marginLeft: `${leftPanelSize}px`,
      }}
      className={cx("Content h-full transition-all duration-300 ease-in-expo")}
    >
      {children}
    </div>
  );
}
export default WorkspaceContentView;
