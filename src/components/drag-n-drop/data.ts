import { Collection } from "@/lib/types";
import { ColumnMap } from "./board-context";

export function getBasicData(collections: Collection[]) {
  const columns = collections.map((coll, index) => {
    return {
      title: coll.name,
      columnId: coll._id,
      items: coll.children,
    };
  });

  const outputData: ColumnMap = {};

  columns.forEach((item) => {
    const list = item.items.sort((a, b) => a.sortIndex - b.sortIndex);
    outputData[item.columnId] = {
      title: item.title,
      columnId: item.columnId,
      items: list,
    };
  });

  const orderedColumnIds = collections.map((coll) => coll._id);

  return {
    columnMap: outputData,
    orderedColumnIds,
  };
}
