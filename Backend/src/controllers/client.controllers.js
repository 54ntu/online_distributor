import { isValidObjectId } from "mongoose";
import Client from "../models/client.models.js";
import APiResponse from "../services/Apiresponse.js";

class ClientController {
  static async addClient(req, res) {
    const salerep = req.user;
    // console.log(salerep.userid);
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        message: "please provide all information.!",
      });
    }

    const isClientExist = await Client.findOne({ email });
    if (isClientExist) {
      return res.status(400).json({
        message: "client with given email is already exist",
      });
    }

    const clientdata = await Client.create({
      name,
      email,
      phone,
      address,
      salesRep: salerep.userid,
    });

    const clientCreated = await Client.findById(clientdata._id);
    if (!clientCreated) {
      return res.status(500).json({
        message: "client creation failed!",
      });
    }

    return res
      .status(201)
      .json(
        new APiResponse(200, clientCreated, "client added successfully😊😊😊")
      );
  }

  static async getClient(req, res) {
    const clients = await Client.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "salesRep",
          foreignField: "_id",
          as: "saleRepDetails",
        },
      },

      {
        $unwind: "$saleRepDetails", //unwind the array created by lookup
      },

      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          saleRep: "$saleRepDetails.username",
        },
      },
    ]);
    // console.log(clients);
    if (clients.length === 0) {
      return res.status(404).json({
        message: "client data not found",
      });
    }
    return res
      .status(200)
      .json(
        new APiResponse(200, clients, "client data fetched successfully.!😎😎")
      );
  }

  static async updateClient(req, res) {
    const { id } = req.params;
    const salerep = req.user;
    const salerepId = salerep.userid;

    // console.log("salesrep data is : ", salerep.userid);
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({
        message: "please provide all data for updation",
      });
    }

    const updateclient = await Client.findOneAndUpdate(
      {
        _id: id,
        salesRep: salerepId,
      },
      {
        name,
        email,
        phone,
        address,
      },
      {
        new: true,
      }
    );

    if (!updateclient) {
      return res.status(500).json({
        message: "error updating client",
      });
    }
    return res
      .status(200)
      .json(
        new APiResponse(
          200,
          updateclient,
          "client info is updated successfully.!"
        )
      );
  }

  static async deleteClient(req, res) {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: "please provide valid id",
      });
    }
    const deletedclient = await Client.findByIdAndDelete(id);
    if (!deletedclient) {
      return res.status(500).json({
        message: "client deletion failed.!",
      });
    }
    return res
      .status(200)
      .json(new APiResponse(200, "client deleted successfully.!"));
  }
}

export default ClientController;
