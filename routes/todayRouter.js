// waterRouter.get("/today", getWaterByDate);

import express from "express";
import validateBody from "../helpers/validateBody.js";
import todayController from "../controllers/today-controller.js"
// import { todayDateSchema } from "../schemas/dateSchema.js";
import auth from "../middlewares/auth.js";

const todayRouter = express.Router();

todayRouter.get("/", auth, todayController.getTodayStatistic);

export default todayRouter;

// validateBody(dateSchema)