"use client";

import { ChevronRight, PanelRightClose } from "lucide-react";
import React, { useEffect, useState } from "react";

import { LeftPanelSize } from "./workspace-view";
import { ValueOf } from "next/dist/shared/lib/constants";
import { Workspace } from "@/lib/types/types";
import cx from "classnames";

interface IWorkspaceContentViewProps {
  leftPanel?: React.ReactNode;
  children?: React.ReactNode;
  leftPanelState: ValueOf<typeof LeftPanelSize>;
  onLeftPanelStateChange?: React.Dispatch<React.SetStateAction<number>>
}

function WorkspaceContentView({
  leftPanel,
  children,
  leftPanelState = LeftPanelSize.default,
  onLeftPanelStateChange,
}: IWorkspaceContentViewProps) {
  const [leftPanelSize, setLeftPanelSize] = useState<ValueOf<typeof LeftPanelSize>>(
    leftPanelState
  );

  useEffect(() => {
    setLeftPanelSize(leftPanelState);
  }, [leftPanelState]);

  useEffect(() => {
    onLeftPanelStateChange?.(leftPanelSize);
  }, [leftPanelSize]);

  return (
    <div className="WorkspaceContent h-full">
      <div className=" h-full  w-full  overflow-y-auto bottom-0 left-0 right-0 ">
        <Divider
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
        />
        <Content leftPanelSize={leftPanelSize}>{children}</Content>
        <div
          className={cx(
            "fixed  top-84 cursor-pointer",
            "transition-all duration-1000 delay-200 ease-in-expo z-0 ",
            {
              "hidden opacity-0": leftPanelSize > LeftPanelSize.min,
              "block opacity-100": leftPanelSize < LeftPanelSize.min,
            }
          )}>
          <PanelRightClose size={24} onClick={() => setLeftPanelSize(LeftPanelSize.default)} className={cx(
            "hover:bg-muted rounded p-1 outline-1 cursor-pointer m-2"
          )} />
        </div>
        <LeftPanel leftPanelSize={leftPanelSize}>{leftPanel}</LeftPanel>
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
        "Divider absolute h-[calc(100%-63px)]  w-2 z-10 cursor-col-resize ",
        "transition-all duration-500 ease-in-expo",
        `left-[${leftPanelSize}px]`
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
        `fixed top-[64px] border-r border-border h-full `,
        "transition-all duration-500 ease-in-expo left-0"
      )}>
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
      }}
      className={cx(
        "Content  absolute h-full right-0 transition-all duration-500 ease-in-expo",
        
      )}>
      {children}
    </div>
  );
}
export default WorkspaceContentView;
