import express from "express";
import { Router } from "express";
import {
  loginController,
  registerController,
} from "../controllers/registerController.js";
const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
export default router;
