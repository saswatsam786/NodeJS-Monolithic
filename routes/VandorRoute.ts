import express, { Request, Response, NextFunction } from "express";
import { GetVandorProfile, UpdateVandorProfile, UpdateVandorService, VandorLogin } from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.post("/login", VandorLogin);

router.use(Authenticate);
router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch("/service", UpdateVandorService);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("Hello from the Vandor route");
});

export { router as VandorRoute };
