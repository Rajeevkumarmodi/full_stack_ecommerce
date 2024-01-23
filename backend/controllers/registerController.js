import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

// user registration controller

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

// user Login controller

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
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
    if (!existingUser) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not Register", false));
    }

    // compare password and check
    const passwordMatch = bcrypt.compareSync(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(404).json(new ApiResponse(404, "Invalid credentials"));
    }

    // generate jwt token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );

    res.cookie("authToke", token, { httpOnly: true });
    const user = await User.findOne({ email }).select("-password");
    res
      .status(200)
      .json(
        new ApiResponse(200, "Usser login successfully", true, { user, token })
      );
  } catch (error) {
    console.log("error", error);
    res.status(500).json(new ApiResponse(500, error.message, false));
  }
};

// change password controller

export const changePassword = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res
      .status(404)
      .json(new ApiResponse(404, "all fields are required", false));
  }

  if (password !== confirmPassword) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, "Password and confirm password not match", false)
      );
  }

  try {
    const userId = req.user?._id;
    const hashPassword = bcrypt.hashSync(password, 13);

    const update = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          password: hashPassword,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "password change successfully", true));
  } catch (error) {
    return res.status(404).json(new ApiResponse(404, error.message, false));
  }
};
