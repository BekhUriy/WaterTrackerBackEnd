import express from "express";

import {
//   getAllWater,
  getWaterById,
  addWater,
  updateWater,
  deleteWater,
} from "../controllers/water-controller.js";
import validateBody from "../helpers/validateBody.js";
import {
  waterAddSchema,
  waterUpdateSchema,
} from "../schemas/waterSchema.js";
import auth from "../middlewares/auth.js";
import isEmptyBody from "../helpers/isEmptyBody.js";
import isValidId from "../helpers/isValidId.js";

const waterRouter = express.Router();

waterRouter.use(auth);

// waterRouter.get("/", getAllWater);

waterRouter.get("/:id", 
isValidId, 
getWaterById);

waterRouter.post("/", 
isEmptyBody, 
validateBody(waterAddSchema), addWater);

waterRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(waterUpdateSchema),
  updateWater
);

waterRouter.delete("/:id", 
isValidId, 
deleteWater);

export default waterRouter;
