import mongoose , { Schema, Document } from "mongoose";

import validator from "validator";
import User from "./UserModel"

interface IComment extends Document {
  user: mongoose.ObjectId,
  post:mongoose.ObjectId,
  comment:string
}
const CommentSchema = new Schema<IComment>({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'comment must have a user']
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'comment must have a post']
  },
  comment:{
    type:String,
    required:[true,'comment cannot be empty']
  }

});
export default mongoose.model<IComment>("Comment", CommentSchema);
