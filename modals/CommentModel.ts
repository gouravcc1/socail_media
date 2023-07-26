import mongoose , { Schema, Document } from "mongoose";

import validator from "validator";
import User from "./UserModel"

interface IComment extends Document {
  user: mongoose.ObjectId,
  post:mongoose.ObjectId,
  userName:string,
  comment:string
  createdAt:Date
}
const CommentSchema = new Schema<IComment>({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'comment must have a user']
  },
  userName:{
    type:String,
    // required:[true,'username should be there'],
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'comment must have a post']
  },
  comment:{
    type:String,
    required:[true,'comment cannot be empty']
  },
  createdAt:{
    type:Date,
    default:Date.now()
  }

});
export default mongoose.model<IComment>("Comment", CommentSchema);
