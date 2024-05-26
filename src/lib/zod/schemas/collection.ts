import { CollectionType } from "@/lib/types";
import z from "@/lib/zod";


export const CollectionSchema = z.object({
  id: z.string().describe("The id of the collection/page."),
  name: z.string().describe("The name of the collection/page."),
  object: z.custom<CollectionType>().describe("Object describes the type of the collection. Collections will be of type 'collection' and pages will be of type 'item'."),
  parent: z.string().optional().describe("The parent collection id."),
  children: z.array(z.object({})).optional().describe("The children of the collection."),
  team: z.string().describe("The team Id of the collection/page belongs to."),
  content: z.object({}).optional().describe("The content of the page. This will be a JSON object. if the object is a collection, this will be empty."),
  workspace: z.string().describe("The workspace Id of the collection/page belongs to."),
  meta: z.object({
    title: z.string().describe("The title of the collection/page"),
    slug: z.string().describe("The slug of the collection/page."),
  }).describe("The meta of the team."),
  createdAt: z.date().describe("The date and time the collection/page was created."),
  updatedAt: z.date().describe("The date and time the collection/page was last updated."),
}).openapi({
  description: "A collection.",
  example: {
    id: "1",
    name: "My Collection",
    object: "collection",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    updatedAt: new Date("2021-01-01T00:00:00.000Z"),
    team: "some-team-id",
    workspace: "some-workspace-id",
    meta: {
      title: "My Collection",
      slug: "my-collection",
    },
  },
}).openapi({
  description: "A collection.",
  example: {
    id: "1",
    name: "My Collection",
    object: "collection",
    createdAt: new Date("2021-01-01T00:00:00.000Z"),
    updatedAt: new Date("2021-01-01T00:00:00.000Z"),
    team: "some-team-id",
    workspace: "some-workspace-id",
    meta: {
      title: "My Collection",
      slug: "my-collection",
    },
  },
});

export const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(32).optional().describe("The name of the collection. It is optional and can be a maximum of 32 characters long."),
  object: z.custom<CollectionType>().default("collection").describe("The type of the collection. Collections can be of type 'collection' or 'item'."),
  parent: z.string().optional().describe("The parent collection id."),
}).openapi({
  description: "Create a new collection.",
  example: {
    name: "My Collection",
    object: "collection",
  },
});

export const UpdateCollectionSchema = z.object({
  name: z.string().min(1).max(32).optional().describe("The name of the collection. It is optional and can be a maximum of 32 characters long."),
  parent: z.string().optional().describe("The parent collection id."),
}).openapi({
  description: "Update a collection.",
  example: {
    name: "My updated Collection",
  }
});