import express from "express";
import { deleteApost, getAllPostofFOllowing, postApost } from "./../controllers/PostControllar";
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
import { resizeUserPhoto, uploadPhotoMiddlleware } from "../controllers/uploadImageControllar";
const router = express.Router();
router.route("/").get(protect, getAllPostofFOllowing).post(protect,uploadPhotoMiddlleware,resizeUserPhoto, postApost);
router.route('/:postId').delete(protect,deleteApost);
router
  .route("/like/:postId")
  .patch(protect, LikeOrUnlikePost)
  .get(protect, GetAllLikeForAPost)
router
  .route("/comment/:postId")
  .patch(protect, postAcomment)
  .get(protect, GetAllCommentForAPost);
router.route("/comment/:commentId").delete(protect, deleteAcomment);
export default router;
