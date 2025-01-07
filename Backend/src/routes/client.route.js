import express from "express";
import ClientController from "../controllers/client.controllers.js";
import UserMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router
  .route("/")
  .post(UserMiddleware.isUserLoggedIn, ClientController.addClient)
  .get(UserMiddleware.isUserLoggedIn, ClientController.getClient);

router
  .route("/:id")
  .patch(UserMiddleware.isUserLoggedIn, ClientController.updateClient)
  .delete(UserMiddleware.isUserLoggedIn, ClientController.deleteClient);

export default router;
