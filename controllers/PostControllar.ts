import { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import Post from "../modals/PostModel";
import follow from "../modals/followModel";
import AppError from "../utils/Apperror";
import Comment from "../modals/CommentModel";
import Like from "../modals/LikeModel";
export const postApost: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post = await Post.create({
      user: req.user.id,
      image: req.body.image,
      userName: req.user.userName,
    });
    res.status(200).json({
      status: "success",
      post: post,
    });
  }
);

export const getAllPostofFOllowing: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const followingUsers = await follow.distinct("following", {
      follower: req.user.id,
    });
    const posts = await Post.find({ user: { $in: followingUsers } });
    res.status(200).json({
      status: "success",
      result: posts.length,
      data: {
        posts,
      },
    });
  }
);

export const deleteApost: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postIdToDelete = req.params.postId;

    // Step 1: Find the post
    const post = await Post.findById(postIdToDelete);
    if (!post) {
      return next(new AppError("post not found.", 404));
    }
    //
    if (post.user != req.user.id)
      return next(new AppError("you cannot delete this post", 400));
    // Step 2: Delete all likes of posts
    await Like.deleteMany({ post: postIdToDelete });

    // Step 3: Delete all comments of posts
    await Comment.deleteMany({ post: postIdToDelete });
    // delete post
    await Post.findByIdAndDelete(post._id);

    res.status(200).json({
      status: "success",
      message: "post and related data deleted successfully.",
    });
  }
);
