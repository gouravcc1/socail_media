import * as dotenv from 'dotenv';
import mongodb from 'mongodb';
import * as mongoose from 'mongoose';
dotenv.config({path:'./config.env'});
import app from './app'
const port=Number(process.env.PORT);

const DB:string=(process.env.DATA_BASE?process.env.DATA_BASE:"").replace("<password>",(process.env.DATA_BASE_PASSWORD?process.env.DATA_BASE_PASSWORD:""));
const DBOtions:object={
  useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
}
  mongoose
  .connect(DB,{
  })
    .then((con) => {
        console.log("success conection");
    });
const server = app.listen(port, "127.0.0.1", () => {
  console.log("app is working");
});
