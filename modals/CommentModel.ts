import mongoose, { Schema, Document } from "mongoose";

import validator from "validator";
import User from "./UserModel"

interface Comment  {
  user: mongoose.ObjectId,
  Post:mongoose.ObjectId,
  comment:string
}
const CommentSchema = new mongoose.Schema({
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
export default mongoose.model<Comment>("Comment", CommentSchema);
