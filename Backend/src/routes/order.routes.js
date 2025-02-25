import express from "express";
import OrderController from "../controllers/order.controller.js";
import UserMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router
  .route("/")
  .post(UserMiddleware.isUserLoggedIn, OrderController.createOrder)
  .get(UserMiddleware.isUserLoggedIn, OrderController.getOrder);
router
  .route("/:id")
  .patch(UserMiddleware.isUserLoggedIn, OrderController.updateOrder);

export default router;
