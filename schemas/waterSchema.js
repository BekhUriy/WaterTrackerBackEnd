import mongoose from "mongoose";
import Joi from "joi";
import handlerMongooseError from "../helpers/handlerMongooseError.js";


const waterSchema = new mongoose.Schema(
    {
            date: {
              type: Date,
              default: Date.now,
            },
            amountWater: {
              type: Number,
              min: 0,
              max: 5000,
              default: 0,
            },
            owner: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "user",
              required: true,
            },
            waterRate: {
              type: Number,
              required: true,
            },
          },
          { versionKey: false, timestamps: true }
    
)



waterSchema.post("save", handlerMongooseError);


export const waterAddSchema = Joi.object({
  date: Joi.date(),
  amountWater: Joi.number().min(0).max(5000),
  waterRate: Joi.number().max(15000),
});

export const waterUpdateSchema = Joi.object({
  date: Joi.date(),
  amountWater: Joi.number().min(0).max(5000),
});

const WaterModel = mongoose.model("water", waterSchema);

export default WaterModel;