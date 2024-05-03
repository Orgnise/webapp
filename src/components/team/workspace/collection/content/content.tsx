import Label from "@/components/atom/label";
import { Button } from "@/components/ui/button";
import NovelEditor from "@/components/ui/editor/editor";
import { Collection } from "@/lib/types/types";
import { hasValue } from "@/lib/utils";
import { Editor as Editor$1 } from "@tiptap/core";

interface CollectionContentProps {
  activeItem?: Collection;
  isEditing?: boolean;
  onDebouncedUpdate?:
    | ((editor?: Editor$1 | undefined) => void | Promise<void>)
    | undefined;
}
export default function ItemContent({
  activeItem,
  isEditing = false,
  onDebouncedUpdate,
}: CollectionContentProps) {
  if (!hasValue(activeItem)) {
    return (
      <div className="CollectionContent mx-auto flex h-full max-w-xl flex-1 flex-col place-content-center items-center text-center">
        <span className="font-normal">
          Items are{" "}
          <Label variant="t2" className="mx-1 ">
            collaborative documents
          </Label>
          that help you capture knowledge. For example, a{" "}
          <Label variant="t2" className="mx-1 ">
            meeting note
          </Label>
          item could contain decisions made in a meeting. Items can be grouped
          and nested with collections.
        </span>
        <Button
          variant={"outline"}
          className="mt-4 "
          onClick={() => {
            // createCollection();
          }}
        >
          Create Page
        </Button>
      </div>
    );
  }

  if (!activeItem) {
    return (
      <div className="CollectionContent flex h-full flex-col place-content-center items-center py-8">
        <Label size="body" variant="t2">
          Nothing is selected
        </Label>

        <Label size="caption" variant="s1">
          Select and item or collection from the left panel
        </Label>
      </div>
    );
  }
  return (
    <NovelEditor
      content={activeItem?.content}
      storageKey={activeItem!._id}
      onDebouncedUpdate={onDebouncedUpdate}
    />
  );
}
