// waterRouter.get("/today", getWaterByDate);

import express from "express";
import validateBody from "../helpers/validateBody";
import todayController from "../controllers/today-controller"
import { dateSchema } from "../schemas/dateSchema";

const todayRouter = express.Router();

todayRouter.get("/", validateBody(dateSchema), todayController.getTodayStatistic);

export default todayRouter;
