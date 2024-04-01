// waterRouter.get("/month", getWaterByMonth);

import express from "express";
// import validateBody from "../helpers/validateBody";
import monthController from "../controllers/month-controller.js"
import validateQuery from "../helpers/validateQuery.js";
import { dateSchema } from "../schemas/dateSchema.js";
import auth from "../middlewares/auth.js";

const monthRouter = express.Router();

monthRouter.get("/", auth, validateQuery(dateSchema), monthController.getMonthStatictics);

export default monthRouter;
