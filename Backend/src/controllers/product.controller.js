import { isValidObjectId } from "mongoose";
import Product from "../models/product.models.js";
import APiResponse from "../services/Apiresponse.js";

class ProductController {
  static async addProduct(req, res) {
    try {
      const supplier = req.user;
      // console.log(supplier);
      const supplierId = supplier.userid;
      const { productName, productDesc, productPrice, stock } = req.body;
      if (!productName || !productDesc || !productPrice || !stock) {
        return res.status(400).json({
          message: "please provide all the product details",
        });
      }

      //check whether the product with same productName already exist or not

      const existingProduct = await Product.findOne({
        productName,
        supplier: supplierId,
      });

      if (existingProduct) {
        existingProduct.stock += stock;
        await existingProduct.save();

        return res
          .status(200)
          .json(
            new APiResponse(
              200,
              existingProduct,
              "product already existed so stock has been updated."
            )
          );
      }

      //if product does not exist then create new one
      const addedProduct = await Product.create({
        productName,
        productDesc,
        productPrice,
        stock,
        supplier: supplierId,
      });

      const isProductAdded = await Product.findById(addedProduct._id);
      if (!isProductAdded) {
        return res.status(500).json({
          message: "product addition failed!",
        });
      }
      return res
        .status(201)
        .json(
          new APiResponse(
            201,
            isProductAdded,
            "product addition done successfully"
          )
        );
    } catch (error) {
      return res.status(500).json({
        message: "error adding product!!",
      });
    }
  }

  static async getProductDetails(req, res) {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "supplier",
          foreignField: "_id",
          as: "supplierDetails",
        },
      },
      {
        $unwind: "$supplierDetails",
      },
      {
        $project: {
          productName: 1,
          productPrice: 1,
          stock: 1,
          restockThreshold: 1,
          supplier: "$supplierDetails.username",
        },
      },
    ]);

    if (products.length === 0) {
      return res.status(404).json({
        message: "product data not found😒😑😑😑",
      });
    }

    return res
      .status(200)
      .json(
        new APiResponse(200, products, "products data fetched succefully😊😊")
      );
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const supplier = req.user;
    const supplierId = req.user.userid;
    const { productName, productDesc, productPrice, stock } = req.body;
    if (!productName || !productDesc || !productPrice || !stock) {
      return res.status(400).json({
        message: "please provide all details to update.!",
      });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "please provide valid object id",
      });
    }

    const updatedproduct = await Product.findOneAndUpdate(
      {
        _id: id,
        supplier: supplierId,
      },
      {
        productName,
        productDesc,
        productPrice,
        stock,
        supplier: supplierId,
      },
      {
        new: true,
      }
    );

    if (!updatedproduct) {
      return res.status(500).json({
        message: "data updation failed.!",
      });
    }

    return res
      .status(200)
      .json(
        new APiResponse(
          200,
          updatedproduct,
          "data updated successfully😎😎😎😎"
        )
      );
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "please provide valid object id ",
      });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(500).json({
        message: "product deletion failed.!!",
      });
    }

    return res
      .status(200)
      .json(new APiResponse(200, "product deleted successfully!!"));
  }
}

export default ProductController;
