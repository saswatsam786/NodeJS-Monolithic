import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInput } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models/Food";
import { Order } from "../models/Order";

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = <VandorLoginInput>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor !== null) {
    // validation and given access
    const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt);

    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor._id,
        email: existingVandor.email,
        foodTypes: existingVandor.foodTypes,
        name: existingVandor.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Password is not Valid" });
    }
  }

  return res.json({ message: "Login Credentials are not valid" });
};

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor Information not found" });
};

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { foodTypes, name, address, phone } = <EditVandorInputs>req.body;
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.phone = phone;
      existingVandor.foodTypes = foodTypes;

      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor Information not found" });
};

export const UpdateVandorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vandor.coverImages.push(...images);

      const result = await vandor.save();

      return res.json(result);
    }
  }

  return res.json({ message: "Something went wrong with add food" });
};

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
  const { foodTypes, name, address, phone } = <EditVandorInputs>req.body;
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);

    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }

    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor Information not found" });
};

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;

    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        images: images,
        readyTime: readyTime,
        price: price,
        rating: 0,
      });

      vandor.foods.push(createFood);
      const result = await vandor.save();

      return res.json(result);
    }
  }

  return res.json({ message: "Something went wrong with add food" });
};

export const GetFoods = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vandorId: user._id });

    if (foods !== null) return res.json(foods);
  }

  return res.json({ message: "vandor information not found" });
};

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate("items.food");

    if (orders !== null) {
      return res.status(200).json(orders);
    }
  }
  return res.json({ message: "Order not found" });
};

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order !== null) {
      return res.status(200).json(order);
    }
  }
  return res.json({ message: "Order not found" });
};

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;

  const { status, remarks, time } = req.body;

  if (orderId) {
    const order = await Order.findById(orderId);

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }

    const orderResult = await order.save();

    if (orderResult != null) {
      return res.status(200).json(orderResult);
    }
  }

  return res.json({ message: "Unable to process order" });
};
