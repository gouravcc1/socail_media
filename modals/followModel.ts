import mongoose, { Document, Schema, Model } from "mongoose";
import AppError from "../utils/Apperror";
interface IFollow extends Document {
  follower: mongoose.ObjectId;
  following: mongoose.ObjectId;
  createdAt:Date,
  userName:string,
}

const FollowSchema = new Schema<IFollow>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming it references the User collection
    required: [true, "Who is going to follow? User does not exist."],
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming it references the User collection
    required: [true, "Who are you going to follow? User does not exist."],
  },
  userName:{
    type:String,
    required:[true,'username should be there'],
  },
  createdAt:{
    type:Date,
    default:Date.now()
  }
});

FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

FollowSchema.pre("save", function (next:any) {
  if (this.follower===(this.following)) {
    return next(new AppError("Following yourself is not allowed.", 400));
  }
  next();
});

const FollowModel: Model<IFollow> = mongoose.model<IFollow>("Follow", FollowSchema);

export default FollowModel;
