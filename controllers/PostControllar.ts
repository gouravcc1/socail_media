import { Request, Response, NextFunction } from "express";

export const getAPost = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
  });
};
