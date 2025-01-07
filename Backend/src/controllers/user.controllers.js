import { isValidObjectId } from "mongoose";
import User from "../models/user.models.js";
import APiResponse from "../services/Apiresponse.js";
import hashPassword, { comparedPassword } from "../services/authController.js";
import generateToken from "../services/generateToken.js";

class UserController {
  async userRegister(req, res) {
    // console.log("register page is hitted");
    // console.log(`req  i am getting is ${req.body}`);
    const { username, email, password, phone_no, address, role } = req.body;
    console.log(req.body);
    if (!username || !email || !password || !phone_no || !address || !role) {
      return res.status(400).json({
        message: "all fields are required!!",
      });
    }

    const isUserExist = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (isUserExist) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const encryptPassword = await hashPassword(password);
    const userdata = await User.create({
      username,
      email,
      password: encryptPassword,
      phone_no,
      address,
      role,
    });

    const isuserCreated = await User.findById(userdata._id).select("-password");
    if (!isuserCreated) {
      return res.status(500).json({
        message: "sales rep creation failed.!!",
      });
    }

    return res
      .status(201)
      .json(
        new APiResponse(
          200,
          isuserCreated,
          "SR is created successfully😎😎😎😎"
        )
      );
  }

  async loginUser(req, res) {
    console.log("login page is hitted");
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "email or password required..!!",
        });
      }

      const userExist = await User.findOne({ email });

      if (!userExist) {
        return res.status(404).json({
          message: "email does not exist!!",
        });
      }

      const isPasswordMatched = await comparedPassword(
        password,
        userExist.password
      );

      if (!isPasswordMatched) {
        return res.status(401).json({
          message: "password doesnot matched!!",
        });
      }

      const token = await generateToken(userExist._id, userExist.role);

      return res
        .status(200)
        .json(new APiResponse(200, token, "logged in successfully!😊😊😊"));
    } catch (error) {
      return res.status(500).json({
        message: "error while log in",
      });
    }
  }

  async getSalesRep(req, res) {
    const salesrep = await User.find().select("-password");
    if (salesrep.length === 0) {
      return res.status(404).json("salesrep data not found");
    }
    return res
      .status(200)
      .json(
        new APiResponse(
          200,
          salesrep,
          "salesrep data fetched successfully...!!"
        )
      );
  }

  async deleteSalesRep(req, res) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({
          message: "invalid object id",
        });
      }

      const data = await User.findById(id);
      if (!data) {
        return res.status(404).json({
          message: "data not available",
        });
      }

      await User.findByIdAndDelete(id);
      return res
        .status(200)
        .json(
          new APiResponse(
            200,
            "sales repres. account deleted successfully...!!!"
          )
        );
    } catch (error) {
      return res.status(500).json({
        message: "error while deleting sales repres data",
      });
    }
  }
}

export default new UserController();
