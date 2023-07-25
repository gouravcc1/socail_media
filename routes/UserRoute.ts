import express, { Request, Response } from "express";
import { signUp,login, protect } from "../controllers/AuthenticationControllar";
import {followAUser} from "./../controllers/FollowControlar"
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").patch(login);
router.route("/followOrunfollow/:userId").patch(protect,followAUser);
// router.route("/unfollow/:userId").patch(protect);

export default router;
