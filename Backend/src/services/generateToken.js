import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.js";

const generateToken = (userid, role) => {
  const token = jwt.sign({ userid, role }, envConfig.jwtsecretkey, {
    expiresIn: envConfig.jwtexpiresin,
  });
  return token;
};

export default generateToken;
