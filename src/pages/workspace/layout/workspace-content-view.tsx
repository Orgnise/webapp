import React, { useEffect, useState } from "react";
import cx from "classnames";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import FIcon from "../../../components/ficon";

export const LeftPanelSize = Object.freeze({
  min: 0,
  default: 320,
  large: window.innerWidth / 2,
  max: window.innerWidth,
});

interface IWorkspaceContentViewProps {
  leftPanel?: React.ReactNode;
  content?: React.ReactNode;
  leftPanelState: number;
  onLeftPanelStateChange?: (size: number) => void;
}

function WorkspaceContentView({
  leftPanel,
  content,
  leftPanelState = LeftPanelSize.default,
  onLeftPanelStateChange = (_: number) => {},
}: IWorkspaceContentViewProps) {
  const [leftPanelSize, setLeftPanelSize] = useState(
    LeftPanelSize[leftPanelState]
  );

  useEffect(() => {
    setLeftPanelSize(leftPanelState);
  }, [leftPanelState]);

  useEffect(() => {
    onLeftPanelStateChange(leftPanelSize);
  }, [leftPanelSize]);

  return (
    <div className="Workspace  bg-gray-50 h-full">
      <div className="relative h-full  w-full  overflow-y-auto bottom-0 left-0 right-0">
        <Divider
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
        />
        <Content leftPanelSize={leftPanelSize}>{content}</Content>
        <div
          className={cx(
            "fixed  top-84 cursor-pointer",
            "transition-all duration-1000 delay-200 ease-in-expo z-0",
            {
              "hidden opacity-0": leftPanelSize > LeftPanelSize.min,
              "block opacity-100": leftPanelSize < LeftPanelSize.min,
            }
          )}
        >
          <FIcon
            icon={solid("angles-right")}
            size="1x"
            stroke="1px"
            className={cx(
              "p-2 my-2 ml-1 outline-1 outline-gray-700 text-gray-500 rounded cursor-pointer",
              "hover:bg-gray-200"
            )}
            onClick={() => setLeftPanelSize(LeftPanelSize.default)}
          />
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
      className={cx(
        "absolute  h-full  w-2 z-10 cursor-col-resize",
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
      className={cx(
        `fixed top-[64px] bg-gray-100 w-[${leftPanelSize}px] h-full`,
        "transition-all duration-500 ease-in-expo"
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
      className={cx(
        "absolute  h-full right-0",
        "transition-all duration-500 ease-in-expo",
        `w-[calc(100%-${leftPanelSize}px)]`
      )}
    >
      <div className="px-6 w-full h-full">
        <div className="mx-auto w-full max-w-[720px] h-full">{children}</div>
      </div>
    </div>
  );
}
export default WorkspaceContentView;
