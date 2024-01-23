import User from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const bearerToken = req.header("authorization");

  if (!bearerToken) {
    return res
      .status(404)
      .json(new ApiResponse(404, "User not authorised", false));
  }
  const jwtToken = bearerToken.split(" ")[1];

  // verify jwt token
  try {
    const { userId } = Jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    if (!bearerToken || !jwtToken || !userId) {
      return res
        .status(404)
        .json(new ApiResponse(404, "Please provide valid token", false));
    }

    // find user
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, "User not found ", false));
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(404).json(new ApiResponse(404, error.message, false));
  }
};

export default authMiddleware;
