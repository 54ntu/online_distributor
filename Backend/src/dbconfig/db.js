import mongoose from "mongoose";
import { envConfig } from "../config/config.js";

const connectdb = async () => {
  try {
    await mongoose.connect(`${envConfig.mongodb}`);
    console.log("database connected successfully..!!!");
  } catch (error) {
    console.log(`error connecting database ${error}`);
    process.exit(1);
  }
};

export default connectdb;
