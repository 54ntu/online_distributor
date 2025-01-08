import jwt from "jsonwebtoken";
import { envConfig } from "../config/config.js";

class UserMiddleware {
  async isUserLoggedIn(req, res, next) {
    const token = req.headers.authorization;
    // console.log(token);
    if (!token) {
      return res.status(400).json({
        message: "token is needed",
      });
    }

    const decodedToken = await jwt.verify(token, envConfig.jwtsecretkey);
    if (!decodedToken) {
      return res.status(401).json({
        message: "invalid token",
      });
    }

    req.user = decodedToken;
    next();
  }

  async isAdmin(req, res, next) {
    if (!req.user) {
      return res.status(400).json({
        message: "user role is required",
      });
    }
    if (req.user?.role == "supplier") {
      next();
    } else {
      return res.status(403).json({
        message: "you are not authorized to perform",
      });
    }
  }
}

export default new UserMiddleware();
