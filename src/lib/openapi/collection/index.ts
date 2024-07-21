import { ZodOpenApiPathsObject } from "zod-openapi";
import { createCollection } from "./create-collection";
import { getCollections } from "./get-collections";
import { reorderItem } from "./reorder-item";


export const collectionsPath: ZodOpenApiPathsObject = {
  "/collections": {
    get: getCollections,
    post: createCollection,
  },
  "/collections/reorder": {
    post: reorderItem
  }
};
