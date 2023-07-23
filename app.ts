import express, { Express, Request, Response } from 'express';
const app = express();
const dotenv = require("dotenv");


app.use('/',(req:Request,res:Response,next:Function)=>{
      res.send('app is working');
})
    
export default app;
//
