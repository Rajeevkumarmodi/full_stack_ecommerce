import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerController = async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password || !profilePic) {
    return res
      .status(404)
      .json(new ApiResponse(404, "all fields are required", false));
  }

  if (!email.includes("@") || !email.includes(".")) {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          "Email is not valid please enter valid email",
          false
        )
      );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User already exist", false));
    } else {
      const salt = bcrypt.genSaltSync(13);
      const hashPassword = bcrypt.hashSync(password, salt);

      const newUser = new User({
        name,
        email,
        profilePic,
        password: hashPassword,
      });
      await newUser.save();

      res
        .status(201)
        .json(new ApiResponse(201, "Registration successfull", true));
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(500, error.message, false));
  }
};
