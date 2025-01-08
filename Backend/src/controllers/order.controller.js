import Client from "../models/client.models.js";
import Product from "../models/product.models.js";
import Order from "../models/order.models.js";
import ApiResponse from "../services/Apiresponse.js";
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
}

export default OrderController;
