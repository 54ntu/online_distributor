import Product from "../models/product.models.js";
import APiResponse from "../services/Apiresponse.js";

class ProductController {
  static async addProduct(req, res) {
    const supplier = req.user;
    // console.log(supplier);
    const supplierId = supplier.userid;
    const { productName, productDesc, productPrice, stock } = req.body;
    if (!productName || !productDesc || !productPrice || !stock) {
      return res.status(400).json({
        message: "please provide all the product details",
      });
    }

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
  }

  static async getProductDetails(req, res) {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "User",
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
          supplier: "supplierDetails.username",
        },
      },
    ]);

    console.log(products);
  }
}

export default ProductController;
