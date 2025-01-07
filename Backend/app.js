import express from "express";
import userRoute from "./src/routes/user.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//defining the routes
app.use("/api/v1/user", userRoute);

export default app;
