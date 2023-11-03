import express, { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { CartItem, CreateCustomerInputs, EditCustomerProfileInputs, OrderInputs, UserLoginInputs } from "../dto";
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
import { DeliveryUser, Offer, Transaction, Vandor } from "../models";

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
    cart: [],
    orders: [],
  });

  if (result) {
    // send the otp to customer
    const resp = await onRequestOTP(otp, phone);

    console.log(resp);

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

// Cart Section ----------------------------------------------
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    let cartItems = Array();

    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);

    if (food) {
      if (profile !== null) {
        // Check for cart Items
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // Check and update Unit
          let existFoodItem = cartItems.filter((item) => item.food._id.toString() === _id);
          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          // add new item to cart
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const cartresult = await profile.save();
          return res.status(200).json(cartresult.cart);
        }
      }
    }
  }
  return res.status(400).json({ message: "Error with adding to cart" });
};

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");

    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(400).json({ message: "Cart is empty" });
};

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");

    if (profile != null) {
      profile.cart = [] as any;
      const cartResult = await profile.save();

      return res.status(200).json(cartResult);
    }
  }

  return res.status(400).json({ message: "Cart is already empty" });
};

// --------------------- Delivery Notifications ----------------------------------------------------------------

const assignOrderForDelivery = async (orderId: string, vandorId: string) => {
  // find the vandor
  const vandor = await Vandor.findById(vandorId);

  if (vandor) {
    const areaCode = vandor.pincode;
    const vandorLat = vandor.lat;
    const vandorLng = vandor.lng;
    // find the available of delivery person

    const deliveryPerson = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true });

    if (deliveryPerson) {
      // Check the nearet delivery person and assign the order
      console.log(`Delivery Person ${deliveryPerson[0]}`);

      const currentOrder = await Order.findById(orderId);

      if (currentOrder) {
        // update deliveryId
        currentOrder.deliveryId = deliveryPerson[0]._id;
        const response = await currentOrder.save();

        console.log(response);

        // Notify to Vandor for received New Order using firebase push notification
      }
    } else {
      console.log("Delivery Person not available");
    }
  }

  // update deliveryID
};

// Order Section ----------------------------------------------

const validTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);

  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, currentTransaction };
    }
  }

  return { status: false, currentTransaction };
};

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  // Grab current login customer
  const customer = req.user;

  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {
    // validate transaction
    const { status, currentTransaction } = await validTransaction(txnId);

    if (!status) {
      return res.status(400).json({ message: "Error with Create Order" });
    }

    // Create an Order ID
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById(customer._id);

    // Grab order items from request [{id: string, quantity: number}}]

    let cartItems = Array();

    let netAmount = 0.0;

    let vandorId;

    // Calculate order amount
    const foods = await Food.find()
      .where("_id")
      .in(items.map((item) => item._id))
      .exec();

    foods.map((food) => {
      items.map(({ _id, unit }) => {
        if (food._id == _id) {
          vandorId = food.vandorId;
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
        vendorId: vandorId,
        items: cartItems,
        totalAmount: netAmount,
        paidAmount: amount,
        orderDate: new Date(),
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        readyTime: 45,
      });

      // Finally update orders to user account

      profile.cart = [] as any;
      profile.orders.push(currentOrder);

      currentTransaction.vandorId = vandorId;
      currentTransaction.orderId = orderId;
      currentTransaction.status = "CONFIRMED";

      await currentTransaction.save();

      assignOrderForDelivery(currentOrder._id, vandorId);

      const profileSaveResponse = await profile.save();

      return res.status(200).json(currentOrder);
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

export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {
  const offerId = req.params.id;
  const customer = req.user;

  if (customer) {
    const appliedOffer = await Offer.findById(offerId);
    if (appliedOffer) {
      if (appliedOffer.promoType === "USER") {
        // Only can apply once per user
      } else {
        if (appliedOffer.isActive) {
          return res.status(200).json({ message: "Offer is Valid", offer: appliedOffer });
        }
      }
    }
  }

  return res.status(400).json({ message: "Offer is not valid" });
};

export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  const { amount, paymentMode, offerId } = req.body;

  let payableAmount = Number(amount);

  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.isActive) {
        payableAmount = payableAmount - appliedOffer.offerAmount;
      }
    }
  }

  // Perform Payment Gateway API Call

  // right after payment gateway succcess/ failure

  // Create record on Transaction
  const transaction = await Transaction.create({
    customer: customer._id,
    vandorId: "",
    orderId: "",
    orderValue: payableAmount,
    offerUsed: offerId || "NA",
    status: "OPEN",
    paymentMode: paymentMode,
    paymentResponse: "Payment in Cash on Delivery",
  });

  // return the transaction id

  return res.status(200).json(transaction);
};
