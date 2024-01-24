import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";

import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { error } from "console";

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

// change profile photo controller

export const changeProfilePhoto = async (req, res) => {
  const file = req.file?.originalname;
  // console.log(req.file);

  if (!file) {
    return res
      .status(404)
      .json(new ApiResponse(404, "please provide image", false));
  }
  const extension = path.extname(file);

  if (extension !== ".png" && extension !== ".jpg" && extension !== ".jpeg") {
    return res
      .status(404)
      .json(
        new ApiResponse(404, "only .png , .jpeg , jpg formate allowed", false)
      );
  }

  if (req.file.size > 512000) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, "please provide image size less then 500kb", false)
      );
  }

  try {
    const result = await uploadOnCloudinary(req.file.path);
    if (!result) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Image not uploaded", false));
    }

    // update profile photo

    const userId = req.user?._id;
    const previousImage = req.user?.profilePic;

    const update = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profilePic: result?.secure_url,
        },
      },
      { new: true }
    );

    // find previous image to cloudinaryId
    const imageIdArr = previousImage.split("/");
    const imageId = imageIdArr[imageIdArr?.length - 1];
    const cloudinaryId = imageId.split(".")[0];
    // delete previous image function call
    const deleteResponse = await deleteOnCloudinary(cloudinaryId);
    console.log("deleteResponse", deleteResponse);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "image upload successfully",
          true,
          result?.secure_url
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(500, error.message, false));
  }
};
