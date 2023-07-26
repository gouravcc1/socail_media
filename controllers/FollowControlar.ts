import User from "../modals/UserModel";
import express, { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import AppError from "../utils/Apperror";
import Follow from "../modals/followModel";
import ApiFeatures from "../utils/ApiFeatures";
export const followAUser: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // get logged user and user to followed or unfollowed
    let loggeduser = req.user;
    let user = await User.findById(req.params.userId);

    //check if both exists
    if (!loggeduser || !user)
      return next(new AppError("no user found with that id", 404));

    //check that does your wants to follow own id
    if (loggeduser._id === user._id)
      return next(new AppError("cannot follow yourself", 400));

    // store old follower_of_Logged_user & following_of_other_user
    let oldfollwing = loggeduser.numberOfFollowing;
    let oldfollwers = user.numberOfFollowers;

    // serach if logged_user is following other user or not
    const followdata = await Follow.findOne({
      follower: loggeduser._id,
      following: user._id,
    });

    if (!followdata) {
      // follow a user
      const followProfile = await Follow.create({
        follower: loggeduser._id,
        following: user._id,
        userName: user.userName,
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

    // send res with operation name
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

export const GetAllFollowesOfAUser: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(
      Follow.find({
        follower: req.params.userId,
      }),
      req.query
    )
      .filter()
      .sorting()
      .limitFields()
      .pagination();
    const followers = await features.query;

    res.status(200).json({
      status: "success",
      result: followers.length,
      data: { followers },
    });
  }
);

export const GetAllFollowingOfAUser: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const features = new ApiFeatures(
      Follow.find({
        following: req.params.userId,
      }),
      req.query
    )
      .filter()
      .sorting()
      .limitFields()
      .pagination();
    const following = await features.query;

    res.status(200).json({
      status: "success",
      result: following.length,
      data: { following },
    });
  }
);
