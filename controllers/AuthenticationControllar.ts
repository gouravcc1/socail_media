import { Request, Response, NextFunction } from "express";
import User from "./../modals/UserModel";
import CatchAsync from "../utils/CatchAsync";

export const signUp:any = CatchAsync(
  async (req: Request, res: Response,next: NextFunction) => {
    try {
      const newUser = await User.create({
        name: req.body.name,
        userName: req.body.userName,
        email:req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });
    console.log(req.body);
      res.status(200).json({
        status: "success",
        data: {
          newUser,
        },
      });
    } catch (err) {
      // res.status(399).json({
      //   err:"some err occures"
      // })
      next(err); // Pass the error to the error-handling middleware
    }
  }
);
