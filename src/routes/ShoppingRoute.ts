import express, { Request, Response, NextFunction } from "express";
import { GetFoodAvailability, GetFoodsIn30mins, GetTopRestaurants, RestaurantById, SearchFoods } from "../controllers";

const router = express.Router();

// ---------------- Food Available ----------------
router.get("/:pincode", GetFoodAvailability);

// ---------------- Top Restaurants ----------------
router.get("/top-restaurants/:pincode", GetTopRestaurants);

// ----------------- Food Available in 30 mins --------------------------------
router.get("/foods-in-30-min/:pincode", GetFoodsIn30mins);

// ---------------- Search Foods --------------------------------
router.get("/search/:pincode", SearchFoods);

// ---------------- Find Restaurant By Id -------------------------
router.get("/restaurant/:id", RestaurantById);

export { router as ShoppingRoute };
