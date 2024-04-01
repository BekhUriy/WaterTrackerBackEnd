import express from "express";

import { auth } from "../middlewares/auth.js";
import { getUserData, updateUser, uploadAvatar } from "../controllers/user-controller.js";
import upload from "../middlewares/avatarUpload.js";

const userRouter = express.Router()

userRouter.patch("/update", auth, upload.single('avatar'), updateUser)
userRouter.get("/", auth, getUserData)
userRouter.patch("/avatar", auth, upload.single('avatar'), uploadAvatar)

export default userRouter;


