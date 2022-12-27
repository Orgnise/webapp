import React, { useEffect, useState } from "react";
import cx from "classnames";
import Validator from "../../../../helper/validator";
import FIcon from "../../../../components/ficon";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import useWorkspace from "../../hook/use-workspace.hook";
import CustomDropDown from "../../../../components/custom_dropdown";
import { VerticalEllipse } from "../../../../components/svg-icon/verticle-ellipse";
import CollectionPage from "./collection-page.view";

export default function ItemPage({ item }) {
  const [title, setTitle] = useState("");
  const { deleteCollection, updateCollection } = useWorkspace();

  useEffect(() => {
    if (Validator.hasValue(item)) {
      setTitle(item.title);
    }
  }, [item]);

  function handleSubmit(e) {
    e.preventDefault();
    updateCollection(item.id, title);
  }

  return (
    <div className="flex flex-col gap-8 h-full  py-10">
      <div className="flex items-center place-content-between">
        <FIcon icon={regular("copy")} className="pr-1" />
        <CustomDropDown
          button={
            <div className="h-4">
              <VerticalEllipse />
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer transition-all ease-in duration-200"
              onClick={() => {
                deleteCollection(item.id, item.parent);
              }}
            >
              Delete
            </div>
          </div>
        </CustomDropDown>
      </div>
      <div className="font-semibold text-4xl">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full bg-transparent"
          />
        </form>
      </div>
      <div className="p-2">{item.content}</div>
    </div>
  );
}
