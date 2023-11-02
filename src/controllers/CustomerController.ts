import express, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CreateCustomerInputs, EditCustomerProfileInputs, OrderInputs, UserLoginInputs } from "../dto/Customer.dto";
import {
  GenerateOTP,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  onRequestOTP,
} from "../utility";
import { Customer } from "../models/Customer";
import { Food } from "../models/Food";
import { Order } from "../models/Order";

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);

  const inputErrors = await validate(customerInputs, { validationError: { target: true } });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOTP();

  const existCustomer = await Customer.findOne({ email: email });

  if (existCustomer !== null) {
    return res.status(409).json({ message: "An user exists with this email" });
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result) {
    // send the otp to customer
    await onRequestOTP(otp, phone);

    // generate the signature
    const signature = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    // send the result to client
    return res.status(201).json({ signature: signature, veified: result.verified, email: result.email });
  }

  return res.status(400).json({ message: "Error with Signup" });
};

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  const loginInputs = plainToClass(UserLoginInputs, req.body);

  const loginErrors = await validate(loginInputs, { validationError: { target: false } });

  if (loginErrors.length > 0) {
    return res.status(400).json(loginErrors);
  }

  const { email, password } = loginInputs;

  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await ValidatePassword(password, customer.password, customer.salt);

    if (validation) {
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(201).json({
        signature: signature,
        verified: customer.verified,
        email: customer.email,
      });
    }
  }

  return res.status(404).json({ message: "Login Error" });
};

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      if (parseInt(profile.otp) === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });

        return res.status(200).json({
          signature: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }

  return res.status(400).json({ message: "Error with otp validation" });
};

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOTP();

      profile.otp = JSON.stringify(otp);
      profile.otp_expiry = expiry;

      await profile.save();

      await onRequestOTP(otp, profile.phone);

      return res.status(200).json({ message: "OTP sent to your registered phone number" });
    }
  }

  return res.status(400).json({ message: "Error with otp validation" });
};

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      return res.status(200).json(profile);
    }
  }
};

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

  const profileErrors = await validate(profileInputs, { validationError: { target: false } });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }

  const { firstName, lastName, address } = profileInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();

      return res.status(200).json(result);
    }
  }
};

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  // Grab current login customer
  const customer = req.user;

  if (customer) {
    // Create an Order ID
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer._id);

    // Grab order items from request [{id: string, quantity: number}}]
    const cart = <[OrderInputs]>req.body;

    let cartItems = Array();

    let netAmount = 0.0;

    // Calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    // Create order with item descriptions
    if (cartItems) {
      // Create order
      const currentOrder = await Order.create({
        orderID: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentResponse: "",
        orderStatus: "Waiting",
      });

      // Finally update orders to user account
      if (currentOrder) {
        profile.orders.push(currentOrder);
        await profile.save();

        return res.status(200).json(currentOrder);
      }
    }
  }

  return res.status(400).json({ message: "Error with creating order" });
};

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }
};

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");

    if (order) {
      return res.status(200).json(order);
    }
  }

  return res.status(400).json({ message: "Error with fetching order" });
};
