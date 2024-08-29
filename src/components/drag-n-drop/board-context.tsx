import { createContext, useContext } from "react";

import invariant from "tiny-invariant";

import { Collection } from "@/lib/types";
import type { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/types";

export type ColumnType = {
  title: string;
  columnId: string;
  collection: Collection;
  items: Collection[];
};
export type ColumnMap = { [columnId: string]: ColumnType };

export type BoardContextValue = {
  getColumns: () => ColumnType[];

  reorderColumn: (args: { startIndex: number; finishIndex: number }) => void;

  reorderCard: (args: {
    columnId: string;
    startIndex: number;
    finishIndex: number;
  }) => void;

  moveCard: (args: {
    startColumnId: string;
    finishColumnId: string;
    itemIndexInStartColumn: number;
    itemIndexInFinishColumn?: number;
  }) => void;

  registerCard: (args: {
    cardId: string;
    entry: {
      element: HTMLElement;
      actionMenuTrigger: HTMLElement;
    };
  }) => CleanupFn;

  registerColumn: (args: {
    columnId: string;
    entry: {
      element: HTMLElement;
    };
  }) => CleanupFn;

  instanceId: symbol;
};

export const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const value = useContext(BoardContext);
  invariant(value, "cannot find BoardContext provider");
  return value;
}
