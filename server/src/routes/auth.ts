import express from "express";

const router = express.Router();
import {
  createUser,
  getUser,
  generateOTP,
  verifyOTP,
} from "../controller/auth";

router.get("/", getUser);
router.post("/", createUser);
// router.patch("/", updateUser);
// router.delete("/:id", deleteUser);

router.get("/verify-otp", verifyOTP);
router.get("/generate-otp", generateOTP);

export default router;
