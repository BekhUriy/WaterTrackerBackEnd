import express from "express";
import {
  changePassword,
  changePasswordEmail,
  currentUser,
  loginUser,
  logoutUser,
  signupUser,
  updatePassword,
  updatePasswordWithVerification,
  verifyPasswordChange,
  verifyUser,
} from "../controllers/auth-controller.js";
import { auth } from "../middlewares/auth.js";
import { createUserSchema, passwordUpdateSchema } from "../schemas/userSchema.js";
import validateBody from "../helpers/validateBody.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(createUserSchema), signupUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", auth, logoutUser);
authRouter.get("/current", auth, currentUser);
authRouter.post("/verify/:verificationToken", verifyUser);

authRouter.patch("/updatepassword", auth, updatePassword);
authRouter.patch(
  "/update-pasword-with-verification",
  auth,
  validateBody(passwordUpdateSchema),
  updatePasswordWithVerification
);
authRouter.patch("/verifypassword/:verificationToken", verifyPasswordChange);
authRouter.post("/sendemail", changePasswordEmail);
authRouter.patch("/reset-password", validateBody(passwordUpdateSchema), changePassword);

export default authRouter;
