import mongoose from "mongoose";
import { userRole } from "../global";

const userSchema = new mongoose.Schema(
  {
    name: {
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
      required: true,
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
