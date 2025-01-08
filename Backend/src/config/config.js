import dotenv from "dotenv";
dotenv.config();

export const envConfig = {
  port: process.env.PORT,
  mongodb: process.env.MONGODB_URL,
  admin_username: process.env.ADMIN_USERNAME,
  admin_password: process.env.ADMIN_PASSWORD,
  admin_email: process.env.ADMIN_EMAIL,
  jwtsecretkey: process.env.JWT_SECRET_KEY,
  jwtexpiresin: process.env.JWT_EXPIRES_IN,
  email: process.env.EMAIL,
  password: process.env.EMAIL_PASSWORD,
};
