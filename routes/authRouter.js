import express from "express";
import { currentUser, loginUser, logoutUser, signupUser } from "../controllers/auth-controller.js";
import { auth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post('/signup', signupUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', auth, logoutUser)
authRouter.get('/current', auth, currentUser)

export default authRouter;
