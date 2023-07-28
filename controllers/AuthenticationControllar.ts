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
      expiresIn: process.env.JWT_TOKEN_EXPIRE_IN
        ? process.env.JWT_TOKEN_EXPIRE_IN
        : "90d",
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
export const isLoggedIn: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check the authorisation header exists
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;

      if (!token) return next();

      const decoded: any = await verifyJwt(
        String(token),
        process.env.JWT_SECRET || ""
      );

      const user = await User.findById(decoded.id);
      if (!user) {
        return next();
      }

      res.locals.user = user;
      return next();
    }
    return next();
  }
);
export const protect: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check the authorisation header exists
    let token, authHeader;
    if (req.headers.authorization) {
      authHeader = req.headers.authorization;
      authHeader = String(authHeader);
    }
    //varify with 
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) return next(new AppError("user not logged in", 403));
    const decoded: any = await verifyJwt(
      String(token),
      process.env.JWT_SECRET || ""
    );
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError("user not found", 403));
    }
    // console.log(req.cookies);
    req.user = user;
    next();
  }
);
export const signUp: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // create user with provided info
    const newUser = await User.create({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      image:req.file?req.file.filename:undefined,
    });
    //send token with new cookies 
    sendJWTTOken(newUser, 200, res);
  }
);
export const login: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let user: any;
    const email = req.body.email, // get user email
      userName = req.body.userName; // get users  user_name
    if (!email && !userName){
      return next(new AppError("provide an email or username", 400));
    }
    if (!req.body.password) {
      return next(new AppError("provide password", 400));
    }
    // find with email
    if (email){
      user = await User.findOne({
        email: email,
      }).select("+password");
      //find with username
    } else if(userName){
      user = await User.findOne({
        userName: userName,
      }).select("+password");
    }
    // compare saved password with provided password
    if (!user || !(await comparePassword(req.body.password, user.password))) {
      return next(new AppError("wrong username or mail or password", 400));
    }
    // send token and response
    sendJWTTOken(user, 200, res);
    return;
  }
);

export const logout: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", ""); // send empty cookie to revoke all access
    res.status(200).json({
      status: "success",
    });
  }
);
