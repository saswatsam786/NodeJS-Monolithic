import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";

export const FindVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email: email });
  } else {
    return await Vandor.findById(id);
  }
};

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
  const { name, ownerName, foodTypes, pincode, address, phone, email, password } = <CreateVandorInput>req.body;

  const existingVandor = await FindVandor("", email);

  if (existingVandor) return res.json({ message: "Vandor already exist with this email ID" });

  // Generate the Salt
  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodTypes: foodTypes,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createVandor);
};

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
  const vandors = await Vandor.find();

  if (vandors !== null) return res.json(vandors);

  return res.json({ message: "Vandors data not available" });
};

export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {
  const vandorId = req.params.id;

  const vandor = await FindVandor(vandorId);

  if (vandor !== null) return res.json(vandor);

  return res.json({ message: "Vandor data not available" });
};
