import { envConfig } from "./src/config/config.js";
import bcrypt from "bcrypt";
import User from "./src/models/user.models.js";
import hashPassword from "./src/services/authController.js";

const adminSeeder = async () => {
  const data = await User.find({
    email: envConfig.admin_email,
  });

  const encryptedPassword = await hashPassword(envConfig.admin_password);
  if (data.length == 0) {
    await User.create({
      username: envConfig.admin_username,
      email: envConfig.admin_email,
      password: encryptedPassword,
      role: "supplier",
    });
    console.log("admin seeded successfully..!!");
  } else {
    console.log("please try again later😑😑");
  }
};

export default adminSeeder;
