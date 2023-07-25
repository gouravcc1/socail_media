import express, { Request, Response } from "express";
import { signUp,login } from "../controllers/AuthenticationControllar";
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/login").patch(login);


export default router;
