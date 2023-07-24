import express, { Request, Response } from "express";
import {getAPost} from './../controllers/PostControllar'
const router = express.Router();

router.get('/',getAPost)
export default router;
