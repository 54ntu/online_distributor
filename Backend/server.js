import adminSeeder from "./adminSeeder.js";
import app from "./app.js";
import { envConfig } from "./src/config/config.js";
import connectdb from "./src/dbconfig/db.js";

connectdb()
  .then(() => {
    adminSeeder();
    app.listen(envConfig.port, () => {
      console.log(`server is listening at port ${envConfig.port}`);
    });
  })
  .catch((error) => {
    console.log("database connection failed..!!");
  });
