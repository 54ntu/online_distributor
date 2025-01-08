import express from "express";
import UserMiddleware from "../middleware/auth.middleware.js";
import ProductController from "../controllers/product.controller.js";
const router = express.Router();

router
  .route("/")
  .post(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    ProductController.addProduct
  );

export default router;
