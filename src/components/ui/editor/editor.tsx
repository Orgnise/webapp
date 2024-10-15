"use client";
import { getOS } from "@/lib/functions";
import { cn } from "@/lib/utils";
import { Editor as Editor$1 } from "@tiptap/core";
import { type EditorProviderProps } from "@tiptap/react";
import {
  EditorBubble,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Separator } from "../separator";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const extensions = [...defaultExtensions, slashCommand];

interface EditorProp {
  content?: JSONContent;
  storageKey?: string;
  editorClassName?: string;
  onDebouncedUpdate?:
    | ((editor?: Editor$1 | undefined) => void | Promise<void>)
    | undefined;
}
const Editor = ({
  content,
  storageKey,
  onDebouncedUpdate,
  editorClassName,
  ...props
}: EditorProp & Partial<EditorProviderProps>) => {
  // const [saveStatus, setSaveStatus] = useState("Saved");
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      onDebouncedUpdate?.(editor);
      // const json = editor.getJSON();
      // window.localStorage.setItem("novel-content", JSON.stringify(json));
      // setSaveStatus("Saved");
    },
    500,
  );

  // useEffect(() => {
  //   console.log("Storage Key", storageKey);
  //   const storageContent = window.localStorage.getItem(
  //     storageKey ?? "novel-content",
  //   );
  //   if (hasValue(storageContent)) {
  //     setInitialContent(JSON.parse(storageContent!));
  //     console.log("Storage Content");
  //   } else if (hasValue(content)) {
  //     setInitialContent(content!);
  //     console.log("Set content", content);
  //   } else {
  //     const data = {
  //       type: "doc",
  //       content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
  //     };
  //     setInitialContent(data);
  //     console.log("Default Content", data);
  //   }
  // }, [content, storageKey]);

  // if (!initialContent) return null;

  return (
    <div className="relative h-full w-full max-w-screen-lg flex-grow">
      {props.editable ? (
        <div className="no-print absolute right-5 top-5 z-10 mb-5 text-xs">
          Press{" "}
          <kbd className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
            {getOS() === "MacOS" ? "Cmd" : "Ctrl"} + s
          </kbd>{" "}
          to save
        </div>
      ) : (
        <></>
      )}
      <EditorRoot>
        <EditorContent
          {...props}
          {...(content && { initialContent: content })}
          extensions={extensions}
          autofocus
          className={cn(
            "relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background p-4 sm:mb-[calc(20vh)] sm:rounded-lg sm:border",
            editorClassName,
          )}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose-base prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            // onChange(editor.getJSON());
            debouncedUpdates(editor);
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: "top",
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default Editor;
