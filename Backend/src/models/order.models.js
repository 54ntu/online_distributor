import mongoose from "mongoose";
import { orderStatus } from "../global/index.js";

const orderSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    salesRep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: [
        orderStatus.Pending,
        orderStatus.Delivered,
        orderStatus.Cancelled,
        orderStatus.Shipped,
      ],
      default: orderStatus.Pending,
    },

    shipmentTracking: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
