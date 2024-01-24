import express from "express";
import { Router } from "express";
import {
  changePassword,
  changeProfilePhoto,
  loginController,
  registerController,
} from "../controllers/registerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploader from "../middleware/multerMiddleware.js";
const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/changepassword", authMiddleware, changePassword);
router.post(
  "/changeprofilepic",
  uploader.single("profilePic"),
  authMiddleware,
  changeProfilePhoto
);
export default router;
