import express, { Request, Response } from "express";
import { getAPost, postApost } from "./../controllers/PostControllar";
import { protect } from "./../controllers/AuthenticationControllar";
import { LikeOrUnlikePost } from "../controllers/LikeControllar";
const router = express.Router();
// router.get("/", getAPost)
router.route("/").get(protect, getAPost).post(protect, postApost);
router.route("/likeorunlike/:postId").patch(protect, LikeOrUnlikePost);
export default router;
