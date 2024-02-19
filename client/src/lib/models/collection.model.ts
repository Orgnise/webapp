// import Mongoose from "mongoose";
// const Schema = Mongoose.Schema;

import { ObjectId } from "mongodb";
import { Meta } from "./team.modal";

export interface CollectionDTO {
  _id: string;
  object: "item" | "collection";
  workspace: ObjectId;
  children: any;
  team: ObjectId;
  parent: ObjectId;
  /**
   * @deprecated title is deprecated, use name instead
   */
  title: string;
  name: string;
  content: string;
  sortIndex: number;
  meta: Meta;
  createdAt: string;
  createdBy: ObjectId;
  updatedBy?: ObjectId;
  updatedAt: string;
}
