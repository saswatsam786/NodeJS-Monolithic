import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";

import { AdminRoute, VandorRoute } from "./routes";
import { MONGO_URI } from "./config";

const app = express();

import { ConnectOptions } from "mongoose";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/admin", AdminRoute);
app.use("/vandor", VandorRoute);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("error" + err));

app.listen(8000, () => {
  console.clear();
  console.log("Server is listening on port 8000");
});
