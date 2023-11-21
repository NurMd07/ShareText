import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import dotenv from 'dotenv';
dotenv.config();

const store = MongoStore.create({
    mongoUrl: `${process.env.Environment==='production'?process.env.MONGO_URI:"mongodb://127.0.0.1:27017/"}`,
    dbName: `${process.env.DB_NAME}`,
    collectionName: "sessions",
    ttl:1000 * 60 * 60 * 24 * 7,
    client: mongoose.connection,
  });


export default store;