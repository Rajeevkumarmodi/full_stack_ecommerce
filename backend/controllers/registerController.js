import User from "../models/user.models.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const { name, email, password, profilePic } = req.body;

  if (!name || !email || !password || !profilePic) {
    return res
      .status(404)
      .json({ success: false, message: "all fields are required" });
  }

  if (!email.includes("@") || !email.includes(".")) {
    return res.status(404).json({
      success: false,
      message: "Email is not valid please enter valid emain",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User already exist" });
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

      res.status(201).json({
        success: true,
        message: "Register successfully",
        data: newUser,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};
