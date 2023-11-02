import mongoose, { ConnectOptions } from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log("DB Connected...");
  } catch (ex) {
    console.log(ex);
  }
};
