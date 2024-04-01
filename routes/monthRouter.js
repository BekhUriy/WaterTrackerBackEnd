import express from "express";
import monthController from "../controllers/month-controller.js"
import validateQuery from "../helpers/validateQuery.js";

import { monthAddSchema } from "../schemas/dateSchema.js";
import auth from "../middlewares/auth.js";

const monthRouter = express.Router();

monthRouter.get("/", auth, validateQuery(monthAddSchema), monthController.getMonthStatictics);

export default monthRouter;
