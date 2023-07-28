import express, { NextFunction, Response, Request } from "express";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import config from "./../firebase.config";
import CatchAsync from "../utils/CatchAsync";
import sharp from "sharp";
import AppError from "../utils/Apperror";
import * as admin from "firebase-admin";
const fapp = initializeApp(config.firebaseConfig);
//   console.log(fapp);
const storage = getStorage();

const multerStorare = multer.memoryStorage();
const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("please upload a image only", 400), false);
  }
};
const upload = multer({ storage: multerStorare, fileFilter: multerFilter });
export const uploadPhotoMiddlleware = upload.single("image");

export const resizeUserPhoto: any = CatchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();
    const uniqueID=req.user?req.user.id:req.body.userName;
    const filename = `user-${uniqueID}-${Date.now()}.jpeg`;
    const resized_image_buffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 60 })
      .toBuffer();
    const storageRef = ref(storage, filename);
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      resized_image_buffer,
      metadata
    );
    req.file.filename = filename;
    next();
  }
);
