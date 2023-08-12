import mongoose from "mongoose";

interface Post {
  user: mongoose.ObjectId;
  userName: string;
  numberOfLikes: number;
  numberOfComments: number;
  createdAt: Date;
  image: string;
}
const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "post must have a user"],
  },
  userName: {
    type: String,
    required: [true, "username should be there"],
  },
  numberOfLikes: { type: Number, default: 0 },
  numberOfComments: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    required: [true, "must add a image with the post"],
  },
});
export default mongoose.model<Post>("Post", PostSchema);
