// waterRouter.get("/today", getWaterByDate);

import express from "express";
import validateBody from "../helpers/validateBody.js";
import todayController from "../controllers/today-controller.js"
import { dateSchema } from "../schemas/dateSchema.js";

const todayRouter = express.Router();

todayRouter.get("/", todayController.getTodayStatistic);

export default todayRouter;

// validateBody(dateSchema)