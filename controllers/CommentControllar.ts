import User from "../modals/UserModel";
import express, { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import AppError from "../utils/Apperror";
import Post from "../modals/PostModel";
import Comment from "../modals/CommentModel";

export const postAcomment: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let post = await Post.findById(req.params.postId);
    if (!post) return next(new AppError("no post found with that id", 404));
    const comment = await Comment.create({
      post: post._id,
      user: req.user.id,
      comment: req.body.comment,
    });
    post.numberOfComments++;
    post = await post.save();
    res.status(200).json({
      status: "success",
      data: {
        post: post,
        comment: comment,
      },
    });
  }
);

export const GetAllCommentForAPost: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   let post = await Post.findById(req.params.postId);
    //   if (!post) return next(new AppError("no post found with that id", 404));
    const comment = await Comment.find({
      post: req.params.postId,
    });
    res.status(200).json({
      status: "success",
      result: comment.length,
      data: { comment },
    });
  }
);

export const deleteAcomment: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //   let post = await Post.findById(req.params.postId);
    //   if (!post) return next(new AppError("no post found with that id", 404));

    const comment = await Comment.findById(req.params.commentId);
    if (!comment ) return next(new AppError("comment does not exits", 404));
    let post = await Post.findById(comment.post);
    if(!post) return next(new AppError('no post found',404));
    if ( comment.user!=req.user.id ) return next(new AppError("you cannot delete others comment", 404));
    await Comment.findByIdAndDelete(comment._id);
    post.numberOfComments--;
    post = await post.save();
    res.status(200).json({
      status: "success",
      data: {
        post: post,
      },
    });
  }
);
