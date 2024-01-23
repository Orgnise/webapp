// import Mongoose from "mongoose";
// // const Role = require("../helper/role");
// // const Visibility = require("../helper/entity-visibility");

// const WorkspaceSchema = new Mongoose.Schema(
//   {
//     team: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "Team",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//       minlength: 3,
//     },
//     description: {
//       type: String,
//       trim: true,
//       minlength: 3,
//     },
//     members: [
//       {
//         user: {
//           type: Mongoose.Schema.Types.ObjectId,
//           ref: "User",
//           required: true,
//         },
//         role: {
//           type: String,
//           enum: [Role.Admin, Role.User],
//           default: "member",
//         },
//       },
//     ],
//     visibility: {
//       type: String,
//       enum: [
//         Visibility.Private,
//         Visibility.Public,
//         Visibility.Archived,
//         Visibility.Deleted,
//       ],
//       default: Visibility.Private,
//     },
//     createdBy: {
//       type: Mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     meta: {
//       type: Object,
//       default: {},
//       title: "",
//       description: "",
//       slug: "",
//     },
//   },
//   { timestamps: true }
// );

// WorkspaceSchema.virtual("isCompleted").get(function () {
//   return this.completedAt !== null;
// });

// WorkspaceSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     delete ret.__v;
//     ret.id = ret._id;
//     delete ret._id;
//     return ret;
//   },
// });

// export default Mongoose.model("Workspace", WorkspaceSchema);

// export const Visibility = {
//   Private: "private",
//   Public: "public",
//   Archived: "archived",
//   Active: "active",
//   Pending: "pending",
//   Deleted: "deleted",
//   Draft: "draft",
//   Completed: "completed",
// };
