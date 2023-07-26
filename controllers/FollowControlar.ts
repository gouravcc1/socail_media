import User from "../modals/UserModel";
import express, { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import AppError from "../utils/Apperror";
import Follow from "../modals/followModel";

export const followAUser: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let loggeduser = await User.findById(req.user.id);
    let user = await User.findById(req.params.userId);

    if (!loggeduser || !user)
      return next(new AppError("no user found with that id", 404));
    if (loggeduser._id === user._id)
      return next(new AppError("cannot follow myself", 400));
    let oldfollwing = loggeduser.numberOfFollowing;
    let oldfollwers = user.numberOfFollowers;
    const followdata = await Follow.findOne({
      follower: loggeduser._id,
      following: user._id,
    });
    if (!followdata) {
      // follow a user
      const followProfile = await Follow.create({
        follower: loggeduser._id,
        following: user._id,
      });
      loggeduser = await User.findByIdAndUpdate(req.user.id, {
        numberOfFollowing: oldfollwing + 1,
      });
      if (loggeduser) loggeduser.numberOfFollowing++;

      user = await User.findByIdAndUpdate(req.params.userId, {
        numberOfFollowers: oldfollwers + 1,
      });
      if (user) user.numberOfFollowers++;
    } else {
      // unfollow A user
      const followProfile = await Follow.findByIdAndDelete(followdata._id);
      loggeduser = await User.findByIdAndUpdate(req.user.id, {
        numberOfFollowing: oldfollwing - 1,
      });
      if (loggeduser) loggeduser.numberOfFollowing--;
      user = await User.findByIdAndUpdate(req.params.userId, {
        numberOfFollowers: oldfollwers - 1,
      });
      if (user) user.numberOfFollowers--;
    }
    res.status(200).json({
      status: "success",
      data: {
        operationName: (followdata ? "unfollowed" : "follwed") + "success",
        follower: loggeduser,
        following: user,
      },
    });
  }
);


