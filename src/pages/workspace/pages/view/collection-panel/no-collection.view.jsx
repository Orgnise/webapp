import React from "react";
import Button from "../../../../../components/atom/button";
import Label from "../../../../../components/typography";
import useWorkspace from "../../../hook/use-workspace.hook";

export default function NoCollectionView({ item }) {
  const { createCollection } = useWorkspace();
  return (
    <div className="flex-1 flex flex-col items-center place-content-center">
      <Label variant="s1">No items or collections</Label>
      <Label variant="s2">Start by creating your first item</Label>
      <Button
        label="Create Item"
        size="small"
        type="link"
        className="mt-2 "
        onClick={() => {
          createCollection();
        }}
      />
    </div>
  );
}
