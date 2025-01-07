import { isValidObjectId } from "mongoose";
import User from "../models/user.models.js";
import ApiError from "../services/ApiError.js";
import APiResponse from "../services/Apiresponse.js";
import hashPassword, { comparedPassword } from "../services/authController.js";
import generateToken from "../services/generateToken.js";

class UserController {
  async userRegister(req, res) {
    const { username, email, password, phone_no, address, role } = req.body;
    if (!username || !email || !password || !phone_no || !address || !role) {
      throw new ApiError(400, "all fields are required..!!");
    }

    const isUserExist = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (isUserExist) {
      throw new ApiError(400, "user already exist");
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
      throw new ApiError(500, "sales representatie creation failed!!");
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
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        throw new ApiError(400, "username or email ,password requires..!!!");
      }

      const userExist = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (!userExist) {
        throw new ApiError(404, "usernmae or email does not exist!!");
      }

      const isPasswordMatched = await comparedPassword(
        password,
        userExist.password
      );

      if (!isPasswordMatched) {
        throw new ApiError(401, "password doesnot matched!!");
      }

      const token = generateToken(userExist._id, userExist.role);

      return res
        .status(200)
        .json(new APiResponse(200, token, "logged in successfully!😊😊😊"));
    } catch (error) {
      throw new ApiError(500, "error while logged in");
    }
  }

  

  async getSalesRep(req, res) {
    const salesrep = await User.find().select("-password");
    if (salesrep.length === 0) {
      throw new ApiError(404, "salesrep data not foud!!!");
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
        throw new ApiError(400, "invali objectid");
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
      throw new ApiError(400, "error while deleting sales repres data");
    }
  }
}

export default new UserController();
