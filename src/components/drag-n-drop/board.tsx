import { forwardRef, useEffect, type ReactNode } from "react";

import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

import { useBoardContext } from "./board-context";

type BoardProps = {
  children: ReactNode;
};

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children }: BoardProps, ref) => {
    const { instanceId } = useBoardContext();

    useEffect(() => {
      return autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId,
      });
    }, [instanceId]);
    return (
      <div
        ref={ref}
        className="Board flex h-full w-full flex-row  gap-4 overflow-auto p-4"
      >
        {children}
      </div>
    );
  },
);

Board.displayName = "Board";
export default Board;
