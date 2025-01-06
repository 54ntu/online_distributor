import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDesc: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
    },
    stock: {
      type: Number,
    },
    restockThreshold: {
      type: Number,
      default: 10,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
