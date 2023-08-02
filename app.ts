import express, { Express, NextFunction, Request, Response } from "express";
import globleErrorHandler from "./controllers/errorControllar";
import PostRoute from "./routes/PostRoute";
import UserRoute from "./routes/UserRoute";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { isLoggedIn } from "./controllers/AuthenticationControllar";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";

const app = express();
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
// app.use(cors.)
const options: cors.CorsOptions = {
  origin: '*',
};
app.use(cors(options));
// security middleware
app.use(helmet());
app.use(cookieParser());
app.use(ExpressMongoSanitize());
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "to many requests from this ip try after some time",
});
app.use(limiter);

app.use(
  express.json({
    limit: "20kb",
  })
); // Parse JSON data in request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data in request body
app.use(bodyParser.json());
// app.use("/", (req, res, next) => {
//   return res.status(200).json({
//     result: "success",
//     data: "website is working",
//   });
// });
app.use("/posts", PostRoute);
app.use("/users", UserRoute);
app.use(globleErrorHandler);
export default app;
//
