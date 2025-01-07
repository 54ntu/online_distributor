import express from "express";
import UserController from "../controllers/user.controllers.js";
import UserMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router
  .route("/")
  .get(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    UserController.getSalesRep
  )
  .post(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    UserController.userRegister
  );
router.route("/login").post(UserController.loginUser);
router
  .route("/:id")
  .delete(
    UserMiddleware.isUserLoggedIn,
    UserMiddleware.isAdmin,
    UserController.deleteSalesRep
  );
export default router;
