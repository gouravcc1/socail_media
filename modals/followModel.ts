import mongoose from "mongoose";
import validator from "validator";
import User from "./UserModel"

interface Follow{
  follower: mongoose.ObjectId,
  following:mongoose.ObjectId,
}
const FollowSchema = new mongoose.Schema({
  follower: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'who is going to follow is user not exit']
  },
  following: {
    type: mongoose.SchemaTypes.ObjectId,
    required:[true,'who are you going to follow is user not exit']
  },

});
export default mongoose.model<Follow>("Follow", FollowSchema);
