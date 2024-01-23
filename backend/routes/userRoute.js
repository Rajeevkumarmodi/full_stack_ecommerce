import express from "express";
import { Router } from "express";
import {
  changePassword,
  loginController,
  registerController,
} from "../controllers/registerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/changepassword", authMiddleware, changePassword);
export default router;
