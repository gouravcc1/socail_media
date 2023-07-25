import { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import User from "../modals/UserModel";
import Follow from "../modals/followModel";
import AppError from "../utils/Apperror";



// export const getAPost:any = CatchAsync( async(req: Request, res: Response, next: NextFunction) => {
//   const followingUsers=await follow.distinct('following',{follower:req.user.id});
//   const posts = await Post.find({ user: { $in: followingUsers }});

//   res.status(200).json({
//     status: "success",
//     data:{
//       posts
//     }
//   });
// });
