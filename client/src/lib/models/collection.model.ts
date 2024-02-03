// import Mongoose from "mongoose";
// const Schema = Mongoose.Schema;

import { Meta } from "./team.modal"
import { ObjectId } from "mongodb"

export interface CollectionDTO {
    contentMeta: ContentMeta
    object: string
    workspace: string
    children: any
    team: ObjectId
    parent: ObjectId
    url: string
    title: string
    content: string
    index: number
    meta: Meta
    createdAt: string
    updatedAt: string
    id: string
  }
  
  export interface ContentMeta {
    itemIds: any[]
  }

// const CollectionSchema = new Schema(
//   {
//     object: {
//       type: String,
//       required: true,
//       default: "item",
//     },
//     workspace: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "Workspace",
//     },
//     parent: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "Collection",
//     },
//     children: {
//       type: [Mongoose.Schema.Types.ObjectId],
//       ref: "Collection",
//     },
//     team: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "Team",
//     },
//     url: {
//       type: String,
//       default: "",
//     },
//     title: {
//       type: String,
//       default: "Undefined",
//     },
//     content: {
//       type: Object,
//       default: "",
//     },
//     index: {
//       type: Number,
//       default: 0,
//     },
//     createdBy: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     contentMeta: {
//       itemIds: {
//         type: [Mongoose.Schema.Types.ObjectId],
//         ref: "Collection",
//       },
//     },
//     lastUpdatedUserId: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     meta: {
//       type: Object,
//       default: {},
//       title: "",
//       description: "",
//       slug: "",
//     },
//   },

//   {
//     timestamps: true,
//     toJSON: {
//       transform: (obj, ret) => {
//         delete ret.__v;
//         ret.id = ret._id;
//         delete ret._id;
//         return ret;
//       },
//     },
//     toObject: {
//       transform: (obj, ret) => {
//         delete ret.__v;
//         ret.id = ret._id;
//         delete ret._id;
//         return ret;
//       },
//     },
//   }
// );

// export default Mongoose.model("Collection", CollectionSchema);
