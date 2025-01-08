import Client from "../models/client.models.js";
import Product from "../models/product.models.js";
import Order from "../models/order.models.js";
import ApiResponse from "../services/Apiresponse.js";
import { isValidObjectId } from "mongoose";
class OrderController {
  static async createOrder(req, res) {
    const salesRep = req.user;
    const salesRepId = salesRep.userid;
    const { client, products } = req.body;

    if (
      !client ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: "client and products details are required",
      });
    }
    const clientExists = await Client.findById(client);
    if (!clientExists) {
      return res.status(404).json({
        message: "client not found... please create client account",
      });
    }

    //validate products and check stock availability
    const productdetails = [];
    for (const item of products) {
      const { productId, quantity } = item;
      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({
          message: "each product must have a valid id and quantity",
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          message: `product with ID ${productId} not found`,
        });
      }

      //check whether the quantity is greater than stock quantity or not
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `insufficient stock for product : ${product.productName} `,
        });
      }

      //create the order
      const newOrder = await Order.create({
        client,
        salesRep: salesRepId,
        products,
      });

      if (!newOrder) {
        return res.status(500).json({
          message: "order creation failed!!",
        });
      }

      //reduce the stock of the product and update it in the table
      product.stock -= quantity;
      await product.save();
      //check if threshold meet or not
      if (product.restockThreshold <= product.stock) {
        console.log(
          `product id ${productId} has reached its restockingthreshold `
        );
      }
      return res
        .status(201)
        .json(
          new ApiResponse(200, newOrder, "order created successfully...!!")
        );
    }
  }

  static async updateOrder(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "please provide valid order id ",
      });
    }

    const updatedorder = await Order.findByIdAndUpdate(
      id,
      {
        status: status,
      },
      {
        new: true,
      }
    );

    if (!updatedorder) {
      return res.status(500).json({
        message: "error while updating order",
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedorder, "order status updated successfully!")
      );
  }

  static async getOrder(req, res) {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "salesRep",
          foreignField: "_id",
          as: "saleRepDetails",
        },
      },
      {
        $unwind: "$saleRepDetails",
      },
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "clientDetails",
        },
      },
      {
        $unwind: "$clientDetails",
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productdetails",
        },
      },
      {
        $unwind: "$productdetails",
      },

      {
        $project: {
          _id: "$_id",
          client: "$clientDetails.name",
          salesRep: "$saleRepDetails.username",
          products: {
            productId: "$productdetails.productName",
            quantity: 1,
          },
          status: 1,
        },
      },
      //lookup for the products data
    ]);

    if (orders.length === 0) {
      return res.status(404).json({
        message: "order data not found....",
      });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, orders, "order data fetched successfully...!!")
      );

    console.log(orders);
  }
}

export default OrderController;
