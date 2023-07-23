import mongoose from "mongoose";
import validator from "validator";
import User from "./UserModel"

interface Like {
  user: mongoose.ObjectId,
  Post:mongoose.ObjectId,
}
const LikeSchema = new mongoose.Schema({
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
