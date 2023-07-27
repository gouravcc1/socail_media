import express, { Request, Response } from "express";
import { signUp,login, protect, logout } from "../controllers/AuthenticationControllar";
import {followAUser,GetAllFollowesOfAUser,GetAllFollowingOfAUser} from "./../controllers/FollowControlar"
import {deleteAuser, getAuser,getAlluser, updateLoggedUser} from "./../controllers/UserControllar"
const router = express.Router();

router.route('/').get(getAlluser);
router.route('/:userId').get(getAuser);

// authentication
router.route("/signUp").post(signUp);
router.route("/login").patch(login);
router.route("/logout").post(protect,logout);

// operation on differnt user
router.route('/following/:userId').get(GetAllFollowesOfAUser);
router.route('/followers/:userId').get(GetAllFollowingOfAUser);


// current_user
router.route('/updateMe').get(protect,updateLoggedUser);
router.route('/deleteAcount').delete(protect,deleteAuser);
router.route("/followOrunfollow/:userId").patch(protect,followAUser);


export default router;
