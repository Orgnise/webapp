import { ZodOpenApiPathsObject } from "zod-openapi";
import { createCollection } from "./create-collection";
import { getCollections } from "./get-collections";


export const collectionsPath: ZodOpenApiPathsObject = {
  "/collections": {
    get: getCollections,
    post: createCollection,
  },
};
