import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { Box, Stack, xcss } from "@atlaskit/primitives";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

import { Collection } from "@/lib/types";
import { hasValue } from "@/lib/utils";
import clsx from "clsx";
import { H2, H3 } from "../atom/typography";
import { ColumnType, useBoardContext } from "./board-context";
import { Card } from "./card";
import { ColumnContext, type ColumnContextProps } from "./column-context";

const cardListStyles = xcss({
  boxSizing: "border-box",
  minHeight: "100%",
  padding: "space.100",
  gap: "space.100",
});

const columnHeaderStyles = xcss({
  paddingInlineStart: "space.200",
  paddingInlineEnd: "space.200",
  paddingBlockStart: "space.100",
  color: "color.text.subtlest",
  userSelect: "none",
});

/**
 * Note: not making `'is-dragging'` a `State` as it is
 * a _parallel_ state to `'is-column-over'`.
 *
 * Our board allows you to be over the column that is currently dragging
 */
type State =
  | { type: "idle" }
  | { type: "is-card-over" }
  | { type: "is-column-over"; closestEdge: Edge | null }
  | { type: "generate-safari-column-preview"; container: HTMLElement }
  | { type: "generate-column-preview" };

// preventing re-renders with stable state objects
const idle: State = { type: "idle" };
const isCardOver: State = { type: "is-card-over" };

const stateStyles: {
  [key in State["type"]]: ReturnType<typeof xcss> | undefined;
} = {
  idle: xcss({
    cursor: "grab",
  }),
  "is-card-over": xcss({
    backgroundColor: "color.background.selected.hovered",
  }),
  "is-column-over": undefined,
  /**
   * **Browser bug workaround**
   *
   * _Problem_
   * When generating a drag preview for an element
   * that has an inner scroll container, the preview can include content
   * vertically before or after the element
   *
   * _Fix_
   * We make the column a new stacking context when the preview is being generated.
   * We are not making a new stacking context at all times, as this _can_ mess up
   * other layering components inside of your card
   *
   * _Fix: Safari_
   * We have not found a great workaround yet. So for now we are just rendering
   * a custom drag preview
   */
  "generate-column-preview": xcss({
    isolation: "isolate",
  }),
  "generate-safari-column-preview": undefined,
};

export const Column = memo(function Column({ column }: { column: ColumnType }) {
  const columnId = column.columnId;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn } = useBoardContext();

  useEffect(() => {
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(headerRef.current);
    invariant(scrollableRef.current);
    return combine(
      registerColumn({
        columnId,
        entry: {
          element: columnRef.current,
        },
      }),
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: "column", instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes("AppleWebKit") &&
            !navigator.userAgent.includes("Chrome");

          if (!isSafari) {
            setState({ type: "generate-column-preview" });
            return;
          }
          setCustomNativeDragPreview({
            getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: "generate-safari-column-preview",
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop() {
          setState(idle);
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId &&
            source.data.type === "column"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },
        onDragEnter: (args) => {
          setState({
            type: "is-column-over",
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          // skip react re-render if edge is not changing
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (
              current.type === "is-column-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return {
              type: "is-column-over",
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "card",
      }),
    );
  }, [columnId, registerColumn, instanceId]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback((id: string) => {
    return stableItems.current.findIndex((item: Collection) => item._id === id);
  }, []);

  const getNumCards = useCallback(() => {
    return stableItems.current.length;
  }, []);

  const contextValue: ColumnContextProps = useMemo(() => {
    return { columnId, getCardIndex, getNumCards };
  }, [columnId, getCardIndex, getNumCards]);

  return (
    <ColumnContext.Provider value={contextValue}>
      <div className="relative">
        <div
          id={`column-${columnId}`}
          ref={columnRef}
          className={clsx(
            " flex h-[calc(100%-64px)] w-64 min-w-64 cursor-grab flex-col gap-1 overflow-y-auto rounded-lg bg-accent/70 transition-colors duration-200",
            {
              "opacity-40": isDragging,
              "bg-info/30": state.type === "is-card-over",
              isolate: state.type === "generate-column-preview",
            },
          )}
        >
          {/* This element takes up the same visual space as the column.
          We are using a separate element so we can have two drop targets
          that take up the same visual space (one for cards, one for columns)
        */}
          <div className={"min-h-0 flex-grow"} ref={columnInnerRef}>
            <div
              className={clsx("min-h-0 flex-grow", {
                "opacity-40": isDragging,
              })}
            >
              <div
                ref={headerRef}
                id={`column-header-${columnId}`}
                className="Header sticky top-0 flex items-center justify-between rounded-t-lg bg-accent p-2 text-secondary-foreground/60"
              >
                <H3 id={`column-header-title-${columnId}`}>
                  {hasValue(column.title) ? column.title : "Untitled Column"}
                </H3>
                {/* <ActionMenu /> */}
              </div>
              <div className="h-full overflow-y-auto" ref={scrollableRef}>
                <Stack xcss={cardListStyles} space="space.100">
                  {column.items.map((item: Collection) => (
                    <Card item={item} key={item._id} />
                  ))}
                </Stack>
              </div>
            </div>
          </div>
        </div>
        {/* SEPARATOR */}
        {state.type === "is-column-over" && state.closestEdge && (
          <div
            className={clsx(
              "flex h-[calc(100%-64px)]   flex-col items-center",
              {
                invisible: state.type !== "is-column-over",
                "absolute -left-2 bottom-0 top-0 ":
                  state.closestEdge === "left",
                "absolute bottom-0 right-3 top-0":
                  state.closestEdge === "right",
              },
            )}
          >
            <div className="flex h-2 w-2 place-content-center items-center rounded-full bg-info">
              <div className="h-1 w-1 rounded-full bg-info-foreground" />
            </div>
            <div className="w-0.5 flex-grow rounded bg-info" />
            <div className="flex h-2 w-2 place-content-center items-center rounded-full bg-info">
              <div className="h-1 w-1 rounded-full bg-info-foreground" />
            </div>
          </div>
        )}
      </div>

      {state.type === "generate-safari-column-preview"
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
        : null}
    </ColumnContext.Provider>
  );
});

const safariPreviewStyles = xcss({
  width: "250px",
  backgroundColor: "elevation.surface.sunken",
  borderRadius: "border.radius",
  padding: "space.200",
});

function SafariColumnPreview({ column }: { column: ColumnType }) {
  return (
    <Box xcss={[columnHeaderStyles, safariPreviewStyles]}>
      <H2>{column.title}</H2>
    </Box>
  );
}
