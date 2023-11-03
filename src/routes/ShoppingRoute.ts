import express, { Request, Response, NextFunction } from "express";
import {
  GetAvailableOffers,
  GetFoodAvailability,
  GetFoodsIn30mins,
  GetTopRestaurants,
  RestaurantById,
  SearchFoods,
} from "../controllers";

const router = express.Router();

// ---------------- Food Available ----------------
router.get("/:pincode", GetFoodAvailability);

// ---------------- Top Restaurants ----------------
router.get("/top-restaurants/:pincode", GetTopRestaurants);

// ----------------- Food Available in 30 mins --------------------------------
router.get("/foods-in-30-min/:pincode", GetFoodsIn30mins);

// ---------------- Search Foods --------------------------------
router.get("/search/:pincode", SearchFoods);

// ----------------- Find Offers --------------------------------
router.get("/offers/:pincode", GetAvailableOffers);

// ---------------- Find Restaurant By Id -------------------------
router.get("/restaurant/:id", RestaurantById);

export { router as ShoppingRoute };
