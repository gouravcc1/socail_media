import mongoose, { Document, Schema, Model } from "mongoose";
import User from "./UserModel";
import AppError from "../utils/Apperror";
import { NextFunction } from "express";

interface IFollow extends Document {
  follower: mongoose.ObjectId;
  following: mongoose.ObjectId;
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
