import express from "express";
import { waterRate } from "../controllers/waterRate-controller.js";
import { updateUserWaterRateSchema } from "../schemas/userSchema.js";
import authenticate from "../middlewares/auth.js";
import validateBody from "../helpers/validateBody.js";

const waterRateRouter = express.Router();

waterRateRouter.patch(
    "/waterrate",
    authenticate,
    validateBody(updateUserWaterRateSchema),
    waterRate
  );

  export default waterRateRouter;