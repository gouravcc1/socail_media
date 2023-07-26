import express, { Request, Response } from "express";
import { getAPost, postApost } from "./../controllers/PostControllar";
import { protect } from "./../controllers/AuthenticationControllar";
import {
  GetAllLikeForAPost,
  LikeOrUnlikePost,
} from "../controllers/LikeControllar";
import {
  GetAllCommentForAPost,
  deleteAcomment,
  postAcomment,
} from "../controllers/CommentControllar";
const router = express.Router();
router.route("/").get(protect, getAPost).post(protect, postApost);
router
  .route("/like/:postId")
  .patch(protect, LikeOrUnlikePost)
  .get(protect, GetAllLikeForAPost);

router
  .route("/comment/:postId")
  .patch(protect, postAcomment)
  .get(protect, GetAllCommentForAPost);
router.route("/comment/:commentId").delete(protect, deleteAcomment);
export default router;
