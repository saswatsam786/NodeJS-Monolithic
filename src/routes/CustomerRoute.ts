import express, { Request, Response, NextFunction } from "express";
import {
  AddToCart,
  CreateOrder,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  DeleteCart,
  EditCustomerProfile,
  GetCart,
  GetCustomerProfile,
  GetOrderById,
  GetOrders,
  RequestOtp,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

// -------------------- Sign Up / Create Customer --------------------
router.post("/signup", CustomerSignUp);

// -------------------- Login --------------------------------
router.post("/login", CustomerLogin);

// authentication
router.use(Authenticate);

// -------------------- Verify Customer Account ----------------------
router.patch("/verify", CustomerVerify);

// --------------------- OTP / Requesting OTP -------------------------
router.post("/otp", RequestOtp);

// ---------------------- Profile -------------------------------------
router.get("/profile", GetCustomerProfile);

router.patch("/profile", EditCustomerProfile);

// Cart
router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

// Order
router.post("/create-order", CreateOrder);

router.get("/orders", GetOrders);

router.get("/order/:id", GetOrderById);

// Payment
export { router as CustomerRoute };
