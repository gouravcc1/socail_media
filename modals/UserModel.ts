import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface User extends Document {
  name: string;
  userName: string;
  email: string;
  numberOfFollowers: number;
  numberOfFollowing: number;
  createdAt: Date;
  profilePic: string;
  password: string;
  passwordConfirm: string;
}

const UserSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
  },
  email: {
    type: String,
    required: [true, "please provide your email"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value: string) {
        return validator.isEmail(value);
      },
      message: "provide a valid email",
    },
  },
  userName: {
    type: String,
    unique: true,
    required: [true, "please provide your username"],
    lowercase: true,
  },
  numberOfFollowers: { type: Number, default: 0 },
  numberOfFollowing: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  profilePic: {
    type: String,
    default: "profile.png",
  },
  password: {
    type: String,
    required: [true, "provide password"],
    minlength: [8, "password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm password"],
    select: false,
  },
});

UserSchema.pre<User>("save", function (next) {
    if (this.password !== this.passwordConfirm) {
      return next(new Error("Passwords do not match."));
    }
    next();
  });

export default mongoose.model<User>("User", UserSchema);
