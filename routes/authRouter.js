import express from "express";
import { currentUser, loginUser, logoutUser, signupUser } from "../controllers/auth-controller.js";
import { auth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post('/signup', signupUser)
authRouter.post('/login', loginUser)
authRouter.get('/logout', auth, logoutUser)
authRouter.get('/current', auth, currentUser)
<<<<<<< Updated upstream
=======
authRouter.post('/verify/:verificationToken', verifyUser)
authRouter.post('/updatepassword', auth, updatePassword)//old pass, new pass, repeat
authRouter.post('/update-password-with-verification', auth, updatePasswordWithVerification)//old pass, new pass, repeat; 200 => verif token, email sent
authRouter.patch('/verifypassword/:verificationToken', verifyPasswordChange)//
>>>>>>> Stashed changes

export default authRouter;
