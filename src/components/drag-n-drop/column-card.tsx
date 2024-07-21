import {
  Fragment,
  forwardRef,
  memo,
  useEffect,
  useRef,
  useState,
  type Ref,
} from "react";

import ReactDOM from "react-dom";
import invariant from "tiny-invariant";
// This is the smaller MoreIcon soon to be more easily accessible with the
// ongoing icon project
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
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { dropTargetForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";

import { Collection } from "@/lib/types";
import { hasValue } from "@/lib/utils";
import clsx from "clsx";
import { CopyIcon } from "lucide-react";
import { H4 } from "../atom/typography";
import { useBoardContext } from "./board-context";

type State =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
  | { type: "dragging" };

const idleState: State = { type: "idle" };
const draggingState: State = { type: "dragging" };

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: Collection;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLDivElement>;
};

const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(
  function CardPrimitive(
    { closestEdge, item, state, actionMenuTriggerRef },
    ref,
  ) {
    const { name, _id } = item;

    return (
      <div
        ref={ref}
        id={`item-${_id}`}
        className="group relative flex flex-col gap-1"
      >
        {/* DIVIDER */}
        {closestEdge && (
          <div
            className={clsx(
              "-left-2 -right-3  flex w-[106%] flex-row items-center",
              {
                "absolute -top-2 ": closestEdge === "top",
                "absolute -bottom-2": closestEdge === "bottom",
              },
            )}
          >
            <div className="flex h-2 w-2 place-content-center items-center rounded-full bg-info">
              <div className="h-1 w-1 rounded-full bg-info-foreground" />
            </div>
            <div className="h-0.5 flex-grow rounded bg-info" />
            <div className="flex h-2 w-2 place-content-center items-center rounded-full bg-info">
              <div className="h-1 w-1 rounded-full bg-info-foreground" />
            </div>
          </div>
        )}
        <div
          className={clsx(
            "rounded bg-card  p-2 py-3.5 text-card-foreground shadow hover:bg-info/10",
            {
              "border-2 border-secondary-foreground/50 opacity-85 shadow-none":
                state.type === "dragging",
            },
          )}
        >
          <div
            ref={actionMenuTriggerRef}
            className="flex flex-row items-center gap-2"
          >
            {hasValue(name) ? (
              <H4 className="flex-grow">{name}</H4>
            ) : (
              <H4 className="flex-grow text-secondary-foreground/60">
                {item.object === "item"
                  ? "Untitled Page"
                  : "Untitled collection"}
              </H4>
            )}
            <CopyIcon
              className={clsx("text-sm text-secondary-foreground/60 ", {
                "hidden group-hover:flex ": item.object == "collection",
                hidden: item.object !== "collection",
              })}
              size={18}
            />
          </div>
        </div>
      </div>
    );
  },
);

export const Card = memo(function Card({ item }: { item: Collection }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { _id } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const actionMenuTriggerRef = useRef<HTMLDivElement>(null);
  const { instanceId, registerCard } = useBoardContext();
  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);
    return registerCard({
      cardId: _id,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current,
      },
    });
  }, [registerCard, _id]);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element: element,
        getInitialData: () => ({ type: "card", itemId: _id, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setState({ type: "preview", container, rect });
              return () => setState(draggingState);
            },
          });
        },

        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForExternal({
        element: element,
      }),
      dropTargetForElements({
        element: element,
        canDrop: ({ source }) => {
          return (
            source.data.instanceId === instanceId && source.data.type === "card"
          );
        },
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: "card", itemId: _id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== _id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== _id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      }),
    );
  }, [instanceId, item, _id]);

  return (
    <Fragment>
      <CardPrimitive
        ref={ref}
        item={item}
        state={state}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />
      {state.type === "preview" &&
        ReactDOM.createPortal(
          <div
            style={{
              /**
               * Ensuring the preview has the same dimensions as the original.
               *
               * Using `border-box` sizing here is not necessary in this
               * specific example, but it is safer to include generally.
               */
              boxSizing: "border-box",
              width: state.rect.width,
              height: state.rect.height,
            }}
          >
            <CardPrimitive item={item} state={state} closestEdge={null} />
          </div>,
          state.container,
        )}
    </Fragment>
  );
});
