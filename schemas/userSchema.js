import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      minlength: 6,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    gender: {
      type: String,
      enum: ["Prefer not to specify", "Female", "Male"],
      default: "Prefer not to specify",
    },
    avatarURL: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
    waterRate: {
      type: Number,
      default: 1500,
      min: 0,
      max: 15000,
      required: true,
    },
    // ownerId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "user",
    // },
    // verify: {
    //   type: Boolean,
    //   default: false,
    // },
    // verificationToken: {
    //   type: String,
    //   required: [true, "Verify token is required"],
    // },
  },
  { versionKey: false, timestamps: true }
);


const User = mongoose.model("user", userSchema);

export const updateUserWaterRateSchema = Joi.object({
  waterRate: Joi.number().max(15000).required(),
});

export const createUserSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'uk', 'org', 'ca'] } })
        .min(6)
        .max(30)
        .trim()
        .required(),
    password: Joi.string()
        .alphanum()
        .min(8)
        .max(64)
        .trim()
        .required(),
  gender: Joi.string()
    .valid("Prefer not to specify", "Female", "Male")
    .default("Prefer not to specify")
});

export const updateUserSchema = Joi.object({
        name: {
      type: String,
  },
      gender: {
      type: String,
      enum: ["Prefer not to specify", "Female", "Male"],
    },
    avatarURL: {
      type: String,
    },
})

export default User;
