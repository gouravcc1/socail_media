import express, { Request, Response } from "express";
import { getAPost, postApost } from "./../controllers/PostControllar";
import { protect } from "./../controllers/AuthenticationControllar";
const router = express.Router();
// router.get("/", getAPost)
router.route("/").get(protect,getAPost).post(protect,postApost);
export default router;
