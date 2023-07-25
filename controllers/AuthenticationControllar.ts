import { Request, Response, NextFunction } from "express";
import User from "./../modals/UserModel";
import CatchAsync from "../utils/CatchAsync";
import jwt from "jsonwebtoken";
import AppError from "../utils/Apperror";
import bcrypt from "bcrypt";
import { promisify } from "util";

const singedToken = (id: string) => {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
    {
      expiresIn: process.env.JWT_TOKEN_EXPIRE_IN?process.env.JWT_TOKEN_EXPIRE_IN:"90d"
    }
  );
};
const sendJWTTOken = (user: any, statusCode: number, res: Response) => {
  const jwtTOken = singedToken(user.id);
  res.cookie("jwt", jwtTOken, {
    secure: true,
    httpOnly: true,
    expires: new Date(
      Date.now() + Number(process.env.JWT_COKIE_EXPIRE_IN) * 24 * 60 * 60 * 1000
    ),
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: jwtTOken,
    data: {
      user,
    },
  });
  return;
};
const comparePassword = (
  userEnteredPassword: string,
  originalPassword: string
) => {
  return bcrypt.compare(userEnteredPassword, originalPassword);
};
const verifyJwt = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
export const protect: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check the authorisation header exists
    let token, hd;
    if (req.headers.authorization) hd = req.headers.authorization;
    // console.log(hd)
    if (!hd) return next(new AppError("user not logged in", 403));
    hd = String(hd);
    if(!hd.startsWith('Bearer')) return next(new AppError("user not logged in", 403));
    token = hd.split(' ')[1];
      const decoded:any = await verifyJwt(
        String(token),
        process.env.JWT_SECRET || ""
      );
      const user=await User.findById(decoded.id);
      if(!user){
        return next(new AppError("user not found", 403));
      }
      // console.log(decoded.iat , Date.now());
      req.user=user;
      next();
  }
);
export const signUp: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    sendJWTTOken(newUser, 200, res);
  }
);
export const login: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user: any;
    if (!req.body.email && !req.body.userName) {
      return next(new AppError("provide an email or username", 400));
    }
    if (!req.body.password) {
      return next(new AppError("provide password", 400));
    }
    if (req.body.id) {
      user = await User.findById(req.body.id).select("+password");
    } else if (req.body.email) {
      user = await User.findOne({
        email: req.body.email,
      }).select("+password");
    } else if (req.body.userName) {
      user = await User.findOne({
        userName: req.body.userName,
      }).select("+password");
    }
    console.log(req.headers);

    if (!user || !(await comparePassword(req.body.password, user.password))) {
      return next(new AppError("wrong username or mail or password", 400));
    }
    sendJWTTOken(user, 200, res);
    return;
  }
);
