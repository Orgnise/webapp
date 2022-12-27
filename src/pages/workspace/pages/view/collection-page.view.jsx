import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListView } from "../../../../components/compound/list-view";
import CustomDropDown from "../../../../components/custom_dropdown";
import FIcon from "../../../../components/ficon";
import { VerticalEllipse } from "../../../../components/svg-icon/verticle-ellipse";
import Validator from "../../../../helper/validator";
import useWorkspace from "../../hook/use-workspace.hook";

export default function CollectionPage({ collection }) {
  const [title, setTitle] = useState("");
  const { workspace, createCollection, deleteCollection, updateCollection } =
    useWorkspace();

  const path = useLocation().pathname;
  const relativePath = path.split(workspace.meta.slug)[0] + workspace.meta.slug;

  useEffect(() => {
    if (Validator.hasValue(collection)) {
      setTitle(collection.title);
    }
  }, [collection]);

  function handleSubmit(e) {
    e.preventDefault();
    updateCollection(collection.id, title);
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
                deleteCollection(collection.id);
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
      <div className="flex flex-col gap-4">
        <ListView
          items={collection.children}
          renderItem={(item) => {
            return (
              <Link
                to={`${relativePath}/${item.id}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <FIcon icon={solid("angle-right")} className="pr-1" />
                <div className="font-sans">{item.title}</div>
              </Link>
            );
          }}
        />
      </div>
    </div>
  );
}
