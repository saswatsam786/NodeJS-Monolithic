import { Request, Response, NextFunction } from "express";
import { EditVandorInputs, VandorLoginInput } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";

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
