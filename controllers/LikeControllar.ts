import User from "../modals/UserModel";
import express, { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import AppError from "../utils/Apperror";
import Post from "../modals/PostModel";
import Like from "../modals/LikeModel";

export const LikeOrUnlikePost: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // let loggeduser = await User.findById(req.user.id);
    // let user = await User.findById(req.params.userId);
    let post = await Post.findById(req.params.postId);

    if (!post) return next(new AppError("no post found with that id", 404));
    let likedfound = await Like.findOne({
      user: req.user.id,
      post: post._id,
    });
    if (!likedfound) {
      const like = await Like.create({
        post: post._id,
        user: req.user.id,
      });
      post.numberOfLikes++;
    } else {
      //for unlike
      await Like.findByIdAndDelete(likedfound._id);
      post.numberOfLikes--;
    }
    post = await post.save();
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  }
);

export const GetAllLikeForAPost: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   let post = await Post.findById(req.params.postId);
    //   if (!post) return next(new AppError("no post found with that id", 404));
    const like = await Like.find({
      post: req.params.postId,
    });
    res.status(200).json({
      status: "success",
      result: like.length,
      data: { like },
    });
  }
);