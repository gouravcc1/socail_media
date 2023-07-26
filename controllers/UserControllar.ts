import { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import User from "../modals/UserModel";
import Follow from "../modals/followModel";
import AppError from "../utils/Apperror";
import Post from "../modals/PostModel";
import Like from "../modals/LikeModel";

import Comment from "../modals/CommentModel";

export const getAuser:any = CatchAsync( async(req: Request, res: Response, next: NextFunction) => {
    let user=await User.findById(req.params.userId);
    if(!user) return next(new AppError('no user found ',404));
    const posts=await Post.find({user:user._id});
    res.status(200).json({
    status: "success",
    data:{
    user,
    noOfPost:posts.length,
    post:posts
    }
  });
});

// delete logged user
export const deleteAuser: any = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userIdToDelete = req.user.id;
      // Step 1: Find the user 
      const user = req.user;
      if (!user) {
        return next(new AppError("User not found.", 404));
      }
  
      // Step 2: Delete all likes made by the user on other posts
      await Like.deleteMany({ user: userIdToDelete });
  
      // Step 3: Delete all comments made by the user on other posts
      await Comment.deleteMany({ user: userIdToDelete });
  
      // Step 4: Delete all follow relations where the user is the follower or following
      await Follow.deleteMany({ $or: [{ follower: userIdToDelete }, { following: userIdToDelete }] });
  
      // Step 5: Find all posts made by the user
      const userPosts = await Post.find({ user: userIdToDelete });
  
      // Step 6: Delete all likes on the user's posts
      const postIdsToDeleteLikes:any = userPosts.map((post) => post._id).flat();
      await Like.deleteMany({ post: { $in: postIdsToDeleteLikes } });
  
      // Step 7: Delete all comments on the user's posts
      const postIdsToDeleteComments = userPosts.map((post) => post._id).flat();
      await Comment.deleteMany({ post: { $in: postIdsToDeleteComments } });
  
      // Step 8: Delete all posts made by the user
      await Post.deleteMany({ user: userIdToDelete });
  
      
  
      // Step 9: Delete the user's account
      await User.findByIdAndDelete(user.id);
      res.status(200).json({
        status: "success",
        message: "User and related data deleted successfully.",
      });
    
  });
