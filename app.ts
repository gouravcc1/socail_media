import express, { Express, NextFunction, Request, Response } from 'express';
import globleErrorHandler from "./controllers/errorControllar"
import PostRoute from './routes/PostRoute'
import UserRoute from './routes/UserRoute'
// import bodyParser from 'body-parser';

const app = express();
const dotenv = require("dotenv");

app.use(express.json()); // Parse JSON data in request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data in request body

// app.use('/',(req:Request,res:Response,next:Function)=>{
//       res.send('app is working');
// })
app.use('/posts',PostRoute);
app.use('/users',UserRoute);
app.use(globleErrorHandler);
export default app;
//
