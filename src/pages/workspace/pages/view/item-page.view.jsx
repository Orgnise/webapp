import React, { useEffect, useState } from "react";
import cx from "classnames";
import Validator from "../../../../helper/validator";
import FIcon from "../../../../components/ficon";
import useWorkspace from "../../hook/use-workspace.hook";
import CustomDropDown from "../../../../components/custom_dropdown";
import { VerticalEllipse } from "../../../../components/svg-icon/verticle-ellipse";
import { regular, solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import CustomEditor from "../../../../components/compound/editorjs/editor";
import EditorTextParser from "../../../../components/compound/editorjs/parser/editor-parser";
import { Fold } from "../../../../helper/typescript-utils";
import { Article } from "../../../../components/compound/editorjs/parser/editorjs-block";

export default function ItemPage({ item }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState();
  const [displayEditors, setDisplayEditors] = useState(false);
  const { deleteCollection, updateCollection } = useWorkspace();

  useEffect(() => {
    if (Validator.hasValue(item)) {
      setTitle(item.title);
      setContent(item.content);
    }
  }, [item]);

  const onKeyDown = (e) => {
    if (e.metaKey && e.which === 83) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  function handleSubmit(e) {
    e.preventDefault();
    updateCollection({
      id: item.id,
      title,
      content,
      parent: item.parent,
    });
  }

  return (
    <div className="flex flex-col gap-3 h-full  py-5">
      <div className="flex items-center place-content-between">
        <FIcon
          icon={!displayEditors ? solid("edit") : regular("circle-check")}
          className="hidden hover:bg-gray-200 rounded p-2 outline-1 outline-gray-500  cursor-pointer h-3 "
          onClick={(e) => {
            setDisplayEditors(!displayEditors);
          }}
        />
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
      <div className="flex flex-col bg-white px-16 py-10 rounded-lg shadow-md">
        <form id={item.id} onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full bg-transparent font-semibold text-4xl"
          />
          <div className="Editor_Wrapper">
            <Fold
              value={!displayEditors ? "content" : null}
              ifPresent={(v) => (
                <CustomEditor
                  reInitOnPropsChange={() => item.id}
                  initialData={item && item.content && item.content}
                  placeholder="Let's write an awesome story!"
                  autofocus={true}
                  onReady={() => {
                    // console.log("Editor is ready ");
                  }}
                  onData={(data) => {
                    setContent(data);
                  }}
                />
              )}
              ifAbsent={() => (
                <Article data={content && content.blocks && content.blocks} />
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
