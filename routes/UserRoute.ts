import express, { Request, Response } from "express";
import { signUp } from "../controllers/AuthenticationControllar";
const router = express.Router();

router.route("/signUp").post(signUp);
// router.route("/login").post(login);


export default router;
