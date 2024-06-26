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
    verify: {
        type: Boolean,
        default: false,
       },
    verificationToken: {
        type: String
    },
    tempPasswordStorage: {
        type: String,
    },
    resetToken: {
      type: String,
    }
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

export const passwordUpdateSchema = Joi.object({
     password: Joi.string()
        .alphanum()
        .min(8)
        .max(64)
        .trim()
        .required(),
})


userSchema.pre('save', async function(next) {
  const user = this;

  if (user.tempPasswordStorage || user.resetToken) {
    await new Promise(resolve => {
      setTimeout(async () => {
        user.resetToken = null;
        user.tempPasswordStorage = null;
        await user.save();
        
        resolve();
      }, 300000); // 5 minutes in milliseconds
    });
  }

  next();
});

export default User;

