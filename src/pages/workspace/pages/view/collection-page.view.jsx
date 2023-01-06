import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListView } from "../../../../components/compound/list-view";
import CustomDropDown from "../../../../components/custom_dropdown";
import SvgIcon from "../../../../components/svg-icon/svg-icon";
import Validator from "../../../../helper/validator";
import useWorkspace from "../../hook/use-workspace.hook";

export default function CollectionPage({ collection }) {
  const [title, setTitle] = useState("");
  const { workspace, deleteCollection, updateCollection } = useWorkspace();

  const path = useLocation().pathname;
  const relativePath = path.split(workspace.meta.slug)[0] + workspace.meta.slug;

  useEffect(() => {
    if (Validator.hasValue(collection)) {
      setTitle(collection.title);
    }
  }, [collection]);

  function handleSubmit(e) {
    e.preventDefault();
    updateCollection({ id: collection.id, title });
  }

  return (
    <div className="flex flex-col gap-4 h-full  py-5">
      <div className="flex items-center place-content-between">
        <SvgIcon icon="Copy" size={3} />
        <CustomDropDown
          button={<SvgIcon icon="VerticalEllipse" size={4} className="h-4" />}>
          <div className="flex flex-col gap-2 rounded border theme-border">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-surface cursor-pointer transition-all ease-in duration-200 rounded"
              onClick={() => {
                deleteCollection(collection.id);
              }}>
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

      <ListView
        items={collection.children}
        renderItem={(item) => {
          return (
            <Link
              to={`${relativePath}/${item.id}`}
              className="flex items-center gap-2 p-2 hover:bg-surface rounded cursor-pointer ">
              <SvgIcon icon="chevronRight" className="pr-1" size={5} />
              <div className="font-sans ">{item.title}</div>
            </Link>
          );
        }}
      />
    </div>
  );
}
