import React, { useEffect, useState } from "react";
import cx from "classnames";
import Validator from "../../../helper/validator";
import { LoaderIcon } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import WorkspaceContentView, {
  LeftPanelSize,
} from "../layout/workspace-content-view";
import Button from "../../../components/atom/button";
import useWorkspace from "../hook/use-workspace.hook";
import CollectionPage from "./view/collection-page.view";
import ItemPage from "./view/item-page.view";
import CollectionPanel from "./view/collection-panel.view";

/**
 * Displays the workspace view
 */
export default function WorkspaceView() {
  const [isLoading, setIsLoading] = useState();

  const [leftPanelSize, setLeftPanelSize] = useState(LeftPanelSize.default);

  const { isLoadingCollection, workspace } = useWorkspace();

  if (isLoading) {
    return (
      <div className="h-full w-full flex place-content-center items-center">
        <LoaderIcon />
      </div>
    );
  }

  return (
    <WorkspaceContentView
      content={<CollectionContent />}
      leftPanelState={leftPanelSize}
      onLeftPanelStateChange={setLeftPanelSize}
      leftPanel={
        <CollectionPanel
          workspace={workspace}
          leftPanelSize={leftPanelSize}
          setLeftPanelSize={setLeftPanelSize}
          isLoadingCollection={isLoadingCollection}
        />
      }
    />
  );
}

function CollectionContent() {
  const [collection, setCollection] = useState();
  const [item, setItem] = useState();
  const { createCollection, allCollection } = useWorkspace();
  const activeCollection = useLocation().pathname.split("/").pop();

  useEffect(() => {
    if (!Validator.hasValue(allCollection)) {
      return;
    }
    const col = allCollection.find(
      (collection) => collection.id === activeCollection
    );

    let item;

    // if collection is not found, check if it is a child item
    if (col === undefined) {
      for (let i = 0; i < allCollection.length; i++) {
        if (Validator.hasValue(allCollection[i].children)) {
          item = allCollection[i].children.find(
            (item) => item.id === activeCollection
          );
          if (item !== undefined) {
            break;
          }
        }
      }
    }
    if (item) {
      setItem(item);
      setCollection();
    } else if (col) {
      setItem();
      setCollection(col);
    } else {
      setItem();
      setCollection();
    }
  }, [activeCollection, allCollection]);

  if (!Validator.hasValue(allCollection)) {
    return (
      <div className="flex-1 flex flex-col items-center place-content-center h-full max-w-xl text-center">
        <span className="font-normal">
          Items are{" "}
          <span className="font-semibold">collaborative documents</span> that
          help you capture knowledge. For example, a <span>meeting note</span>{" "}
          item could contain decisions made in a meeting. Items can be grouped
          and nested with collections.
        </span>
        <Button
          label="Create Item"
          size="small"
          type="outline"
          className="mt-2 "
          onClick={() => {
            createCollection();
          }}
        />
      </div>
    );
  }

  if (!collection && !item) {
    return (
      <div className="flex flex-col items-center place-content-center h-full py-8">
        <div className="font-semibold text-xs text-slate-700">
          Nothing is selected
        </div>
        <div className="font-semibold text-xs text-slate-400">
          Select and item or collection from the left panel
        </div>
      </div>
    );
  }
  return (
    <>
      {collection && <CollectionPage collection={collection} />}
      {item && <ItemPage item={item} />}
    </>
  );
}
