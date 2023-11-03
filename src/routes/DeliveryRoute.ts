import express, { Request, Response, NextFunction } from "express";
import {
  DeliveryUserLogin,
  DeliveryUserSignUp,
  EditDeliveryUserProfile,
  GetDeliveryUserProfile,
  UpdateDeliveryUserStatus,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// -------------------- Sign Up / Create Customer --------------------
router.post("/signup", DeliveryUserSignUp);

// -------------------- Login --------------------------------
router.post("/login", DeliveryUserLogin);

// authentication
router.use(Authenticate);

// -------------------- Change Service Status --------------------------------
router.put("/change-status", UpdateDeliveryUserStatus);

// ---------------------- Profile -------------------------------------
router.get("/profile", GetDeliveryUserProfile);

router.patch("/profile", EditDeliveryUserProfile);

// Payment
export { router as DeliveryRoute };
