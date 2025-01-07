import express from "express";
import userRoute from "./src/routes/user.routes.js";
import clientRoute from "./src/routes/client.route.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//defining the routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/client", clientRoute);

export default app;
