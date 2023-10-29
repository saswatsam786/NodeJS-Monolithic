import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
  const { name, ownerName, foodType, pincode, address, phone, email, password } = <CreateVandorInput>req.body;

  const existingVandor = await Vandor.findOne({ email: email });

  if (existingVandor) return res.json({ message: "Vandor already exist with this email ID" });

  // Generate the Salt
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  // Encrypt the password using the salt

  const createVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });

  return res.json(createVandor);
};

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {};

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {};
