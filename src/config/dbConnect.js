import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.Environment || "development";

mongoose.set("strictQuery", false);

const connectToDb = async () => {
return mongoose
  .connect(`${env==='production'?process.env.MONGO_URI:"mongodb://127.0.0.1:27017,127.0.0.1:27018/dbname?replicaSet=rs0"}`, {
    dbName: `${process.env.DB_NAME}`,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

}
  
export default connectToDb;