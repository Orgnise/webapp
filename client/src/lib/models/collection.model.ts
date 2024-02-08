// import Mongoose from "mongoose";
// const Schema = Mongoose.Schema;

import { Meta } from "./team.modal"
import { ObjectId } from "mongodb"

export interface CollectionDTO {
  _id: string
  object: 'item' | 'collection'
  workspace: ObjectId
  children: any
  team: ObjectId
  parent: ObjectId
  /**
   * @deprecated title is deprecated, use name instead
   */
  title: string
  name: string
  content: string
  sortIndex: number
  meta: Meta
  createdAt: string
  createdBy: ObjectId
  updatedBy?: ObjectId
  updatedAt: string
}
