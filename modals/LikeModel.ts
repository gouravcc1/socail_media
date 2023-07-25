import mongoose, { Schema,Document } from "mongoose";
import validator from "validator";
import User from "./UserModel"

interface Like extends Document {
  user: mongoose.ObjectId,
  post:  mongoose.ObjectId,
}
const LikeSchema  = new Schema<Like>({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'like must have a user']
  },
  post: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'like must have a post']
  }
});
export default mongoose.model<Like>("Like", LikeSchema);
