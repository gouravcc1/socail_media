import  { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import AppError from "../utils/Apperror";
import Post from "../modals/PostModel";
import Comment from "../modals/CommentModel";
import ApiFeatures from "../utils/ApiFeatures";

export const postAcomment: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params; // get post id from the url
    let post = await Post.findById(postId);
    if (!post) return next(new AppError("no post found with that id", 404));
    const comment = await Comment.create({
      post: post._id,
      user: req.user.id,
      comment: req.body.comment,
      userName: req.user.userName,
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
    const features = new ApiFeatures(
      Comment.find({
        post: req.params.postId,
      }),
      req.query
    )
      .filter()
      .sorting()
      .limitFields()
      .pagination();

    const comment = await features.query;
    res.status(200).json({
      status: "success",
      result: comment.length,
      data: { comment },
    });
  }
);

export const deleteAcomment: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return next(new AppError("comment does not exits", 404));

    // check if logged user is authorised to delete or not
    if (comment.user != req.user.id)
      return next(new AppError("you cannot delete others comment", 404));

    // search is the post exits or not (to reduce future bugs or production errors)
    let post = await Post.findById(comment.post);
    if (!post) return next(new AppError("no post found", 404));

    // finaly delete comment
    await Comment.findByIdAndDelete(comment._id);

    // decrease no_of_comments on the post and update the document
    post.numberOfComments--;
    post = await post.save();
    
    //send response
    res.status(200).json({
      status: "success",
      data: {
        post: post,
      },
    });
  }
);
