import mongoose from "mongoose";
import { userRole } from "../global/index.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: [userRole.Supplier, userRole.Sales_rep],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
