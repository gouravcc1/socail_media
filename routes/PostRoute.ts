import express, { Request, Response } from "express";
import {getAPost} from './../controllers/PostControllar'
import {protect} from './../controllers/AuthenticationControllar'
const router = express.Router();
router.get('/',protect,getAPost)
export default router;
