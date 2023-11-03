import express, { Request, Response, NextFunction } from "express";
import { Offer, Vandor } from "../models";
import { FoodDoc } from "../models/Food";

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false })
    .sort([["rating", "descending"]])
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Data Not Found" });
};

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false })
    .sort([["rating", "descending"]])
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const GetFoodsIn30mins = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((vandor) => {
      const foods = vandor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });

    return res.status(200).json(foodResult);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vandor.find({ pincode: pincode, serviceAvailable: false }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];

    result.map((item) => foodResult.push(...item.foods));

    return res.status(200).json(foodResult);
  }

  return res.status(400).json({ message: "Data Not Found" });
};

export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const result = await Vandor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "Data Not Found" });
};

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const offers = await Offer.find({ pincode: pincode, isActive: true });

  if (offers) {
    return res.status(200).json(offers);
  }

  return res.json(400).json({ message: "Offers not Found" });
};
