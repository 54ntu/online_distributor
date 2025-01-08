import express from "express";
import userRoute from "./src/routes/user.routes.js";
import clientRoute from "./src/routes/client.route.js";
import productRoute from "./src/routes/product.routes.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//defining the routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/client", clientRoute);
app.use("/api/v1/product", productRoute);

export default app;
