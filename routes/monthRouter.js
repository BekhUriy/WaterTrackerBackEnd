// waterRouter.get("/month", getWaterByMonth);

import express from "express";
import validateBody from "../helpers/validateBody";
import monthController from "../controllers/month-controller"
import validateQuery from "../helpers/validateQuery";

const monthRouter = express.Router();

todayRouter.get("/", validateQuery(dateSchema), monthController.getMonthStatictics);

export default todayRouter;
