import { Request, NextFunction } from "express";

export default (fn:Function) => {
    return (req:Request, res:Request, next:NextFunction) => {
      fn(req, res, next).catch(next);
    };
  };
  