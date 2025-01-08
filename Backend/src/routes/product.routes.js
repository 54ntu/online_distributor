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
  )
  .get(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    ProductController.getProductDetails
  );

router
  .route("/:id")
  .patch(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    ProductController.updateProduct
  )
  .delete(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    ProductController.deleteProduct
  );

export default router;
