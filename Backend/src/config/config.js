import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
  port: process.env.PORT,
  mongodb: process.env.MONGODB_URL,
  admin_username: process.env.ADMIN_USERNAME,
  admin_password: process.env.ADMIN_PASSWORD,
  admin_email: process.env.ADMIN_EMAIL,
};
