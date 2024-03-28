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
      enum: gender,
      default: "female",
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

const User = model("user", userSchema);

export default User;
