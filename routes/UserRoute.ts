import express, { Request, Response } from "express";
import { signUp,login, protect, logout } from "../controllers/AuthenticationControllar";
import {followAUser,GetAllFollowesOfAUser,GetAllFollowingOfAUser} from "./../controllers/FollowControlar"
import {deleteAuser, getAuser} from "./../controllers/UserControllar"
const router = express.Router();

router.route('/:userId').get(getAuser);
router.route("/signUp").post(signUp);
router.route("/login").patch(login);
router.route("/logout").post(protect,logout);
router.route('/deleteAcount').delete(protect,deleteAuser);
router.route("/followOrunfollow/:userId").patch(protect,followAUser);
router.route('/following/:userId').get(GetAllFollowesOfAUser);
router.route('/followers/:userId').get(GetAllFollowingOfAUser);
// router.route("/unfollow/:userId").patch(protect);

export default router;
