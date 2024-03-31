import express from "express";

import {
//   getAllWater,
  getWaterById,
  addWater,
  updateWater,
  deleteWater,
} from "../controllers/water-controller.js";
// import {
//   authenticate,
//   isValidId,
// } from "../../middleware/index.js";
import validateBody from "../helpers/validateBody.js";
import {
  waterAddSchema,
  waterUpdateSchema,
} from "../schemas/waterSchema.js";
import authenticate from "../middlewares/auth.js";

const waterRouter = express.Router();

waterRouter.use(authenticate);

// waterRouter.get("/", getAllWater);

waterRouter.get("/:id", 
// isValidId, 
getWaterById);

waterRouter.post("/", 
// isEmptyBody, 
validateBody(waterAddSchema), addWater);

waterRouter.put(
  "/:id",
  // isValidId,
  // isEmptyBody,
  validateBody(waterUpdateSchema),
  updateWater
);

waterRouter.delete("/:id", 
// isValidId, 
deleteWater);

export default waterRouter;
