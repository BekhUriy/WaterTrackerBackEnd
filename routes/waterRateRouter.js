import express from "express";
import { waterRate } from "../controllers/waterRate-controller";
import { updateUserWaterRateSchema } from "../schemas/userSchema";

const waterRateRouter = express.Router();

waterRateRouter.patch(
    "/waterrate",
    authenticate,
    validateBody(updateUserWaterRateSchema),
    waterRate
  );