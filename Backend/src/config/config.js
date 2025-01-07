import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
  port: process.env.PORT,
  mongodb: process.env.MONGODB_URL,
};


