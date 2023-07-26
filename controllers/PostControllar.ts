import { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import Post from "../modals/PostModel";
import follow from "../modals/followModel";


export const postApost :any = CatchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const post= await Post.create({
    user:req.user.id,
    image:req.body.image,
    userName:req.user.userName
  })
  res.status(200).json({
    status: "success",
    post:post
  });
});
export const getAPost:any = CatchAsync( async(req: Request, res: Response, next: NextFunction) => {
  const followingUsers=await follow.distinct('following',{follower:req.user.id});
  const posts = await Post.find({ user: { $in: followingUsers }});
  res.status(200).json({
    status: "success",
    data:{
      posts
    }
  });
});
