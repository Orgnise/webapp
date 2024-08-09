// import Mongoose from "mongoose";
// const Schema = Mongoose.Schema;

import { ObjectId } from "mongodb";
import { MetaSchema } from "./team.schema";

export interface CollectionDbSchema {
  _id: ObjectId;
  object: "item" | "collection";
  workspace: ObjectId;
  children: any;
  team: ObjectId;
  parent: ObjectId | null;
  /**
   * @deprecated title is deprecated, use name instead
   */
  title: string;
  name: string;
  content: string;
  sortIndex: number;
  meta: MetaSchema;
  createdAt: Date;
  createdBy: ObjectId;
  updatedBy?: ObjectId;
  updatedAt: Date;
}
