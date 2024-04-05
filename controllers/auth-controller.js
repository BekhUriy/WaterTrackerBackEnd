
import  User, { passwordUpdateSchema } from "../schemas/userSchema.js";
import { createUserSchema } from "../schemas/userSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import crypto from "crypto"
import sendEmail from "../middlewares/email.js"
dotenv.config();

export const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizeEmail = email.toLowerCase().trim();
        const normalizedPassword = password.trim();
        const existingUser = await User.findOne({ email: normalizeEmail });

        if (existingUser) {
            return res.status(409).json({ message: "This email is already in use. Please check email or log in" });
        }


        const verificationToken = crypto.randomUUID();
        const base = process.env.BASE;
        const hashPassword = await bcrypt.hash(normalizedPassword, 10);
        

        // const emailOptions = {
        //     from: process.env.EMAIL,
        //     to: normalizeEmail,
        //     subject: "Verify email",
        //     html: `<p>We're happy you're here! Let's get your email address verified:</p> 
        //         <button><a href="http://${base}/api/auth/verify/${verificationToken}">Click to Verify Email</a></button>.
        //         <p>If you did not register for Water Tracker, we recommend you to ignore this letter.</p>
        //         <p>Keep yourself healthy!</p>
        //                     <p>Best wishes,</p>
        //                     <p>Water Tracker Team</p>`
        // };

        // await sendEmail(emailOptions);
        // if (!sendEmail) {
        //     return res.status(404).json({message: "Error sending email. Try again later"})
        // }

        await User.create({ email: normalizeEmail, password: hashPassword, verificationToken });
        return res.status(200).json({ message: 'Welcome, new user! Keep yourself healthy with our Water Tracker' });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail })
        
        if (user === null) {
            return res.status(401).json({ message: 'Incorrect password or email' });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(401).json({ message: 'Incorrect password or email' });
        }

        const payload = {
         id: user._id,
        };
        
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "30d" })
        await User.findByIdAndUpdate(user._id, { token: token });
        
        const responseData = {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatarURL: user.avatarURL,
                gender: user.gender,
                waterRate: user.waterRate,
                verify: user.verify
            },
            message: user.name ? `Welcome back, ${user.name}.` : `Welcome back, ${user.email}.`,
        };


        return res.status(200).json(responseData);
    }
    catch (error) {
        console.error('Error login user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        // if (!user) {
        //     return res.status(401).json({message: "Logout unsuccessful. Unathorized"})
        // }
        await User.findByIdAndUpdate(req.user.id, { token: null })
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error('Error login user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        // if(user){
            const message = user.name ? `Welcome back, ${user.name}.` : `Welcome back, ${user.email}.`;
            return res.status(200).json({ message });
        // }
        // else {
        //     return res.status(404).json({message:"Unauthorized"})
        // }
    }
    catch(error) {
        console.error('Error user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const verifyUser = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken })
        if (!user) {
            return res.status(404).json({ message: `Already verified or user does not exist` }) 
        }

        await User.updateOne({ verificationToken }, { verify: true, verificationToken: '' });
       return res.status(200).json({ message: 'Verified' });
    } catch (error) {
        console.log("Verification error", error);
        return res.status(500).json({message:"Server error"})
    }
}

export const updatePasswordWithVerification = async (req, res) => {
    try {
        const verificationToken = crypto.randomUUID();
        const { password, newPassword, repeatPassword } = req.body;
        const { id, email } = req.user;

        const user = await User.findById({ _id: id });
        console.log(user)
        const normalizedPassword = password.trim();
        const normalizedRepeatPassword = repeatPassword.trim();
        const normalizedNewPassword = newPassword.trim()
        if (normalizedNewPassword === normalizedRepeatPassword) {
            const passwordCompare = await bcrypt.compare(normalizedPassword, user.password);

            if (passwordCompare) {
                const validation = passwordUpdateSchema.validate({ password: normalizedNewPassword })
                if (validation.error) {
                    return res.status(400).json({ message: validation.error.message });
                }
                const base = process.env.BASE;
                console.log(base)
                const emailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Change password",
                    html: `<p>Hello! If you don't change your password on Water Trecker, please ignore this letter</p> 
                           <p>If you want to confirm password change,  <button><a href="http://${base}/api/auth/verifypassword/${verificationToken}">Click to Verify Password Change</a></button>.</p>
                           <p>Keep yourself healthy!</p>
                            <p>Best wishes,</p>
                            <p>Water Tracker Team</p>`
                };
                await sendEmail(emailOptions);
               
                await User.updateOne({ _id: id }, { verificationToken, tempPasswordStorage: normalizedNewPassword, upfatedAt: Date.now() });

                return res.status(200).json({ message: "Verification email sent" });
            } else {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        } else {
            return res.status(400).json({ message: "Passwords do not match" });
        }
    } catch (error) {
        console.log("Verification error", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const verifyPasswordChange = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        
        if (!user) {
            return res.status(404).json({ message: "Invalid verification token" });
        }
             
        const newPassword = user.tempPasswordStorage 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.updateOne({ verificationToken }, { password: hashedPassword, verificationToken: null, tempPasswordStorage: '' });
        
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log("Password change error", error);
        return res.status(500).json({ message: "Server error" });
    }


}

export const updatePassword = async (req, res) => {
    try {
        
        const { password, newPassword, repeatPassword } = req.body;
        const { id, email } = req.user;

        const user = await User.findById({ _id: id });
        console.log(user)
        const normalizedPassword = password.trim();
        const normalizedRepeatPassword = repeatPassword.trim();
        const normalizedNewPassword = newPassword.trim()
        if (normalizedNewPassword === normalizedRepeatPassword) {
            const passwordCompare = await bcrypt.compare(normalizedPassword, user.password);

            if (passwordCompare) {
                const validation = passwordUpdateSchema.validate({ password: normalizedNewPassword })
                if (validation.error) {
                    return res.status(400).json({ message: validation.error.message });
                }

               const hashedPassword = await bcrypt.hash(normalizedNewPassword, 10);
                await User.updateOne({ _id: id }, {password: hashedPassword});

                // const base = process.env.BASE;
                // console.log(base)
                // const emailOptions = {
                //     from: process.env.EMAIL,
                //     to: email,
                //     subject: "Change password",
                //     html: `<p>Hello! You received this email because you recently changed your password.</p>
                //             <p>We are happy that you continue to use Water Tracker and hope that you have a great time while using our app.</p>
                //             <p>Keep yourself healthy!</p>
                //             <p>Best wishes,</p>
                //             <p>Water Tracker Team</p>`
                // };
                // await sendEmail(emailOptions);
               
 

                return res.status(200).json({ message: "Email sent" });
            } else {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
        } else {
            return res.status(400).json({ message: "Passwords do not match" });
        }
    } catch (error) {
        console.log("Verification error", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const changePasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email })
        console.log(user)
        if (!user) {
            res.status(404).json({ message: `User not found` }) 
        }
        const resetToken=crypto.randomUUID();
            user.resetToken = resetToken;
            await user.save();

            const link = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
            const emailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Change password",
            html: `<p>Hello! If you don't change your password on Water Trecker, please ignore this letter</p> 
                    <p>If you want to change password,  <button><a href="${link}">Click to Prossed Password Change</a></button>.</p>
                    <p>Keep yourself healthy!</p>
                    <p>Best wishes,</p>
                    <p>Water Tracker Team</p>`

            };
            await sendEmail(emailOptions);
            res.status(200).json({ message: `Email sended.` })
        
    } catch (error) {
         console.error('Error sending email:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, repeatPassword } = req.body;
        const { resettoken } = req.query; 
        const user = await User.findOne({ resetToken: resettoken });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }

        const normalizedNewPassword = newPassword.trim();
        const normalizedRepeatPassword = repeatPassword.trim();

        if (normalizedNewPassword !== normalizedRepeatPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }


        const validation = passwordUpdateSchema.validate({password:normalizedNewPassword});
        if (validation.error) {
            return res.status(400).json({ message: validation.error.message });
        }
            const id = user._id
     
                const hashedPassword = await bcrypt.hash(normalizedNewPassword, 10);
                await User.updateOne({ _id: id }, {password: hashedPassword, resetToken:''});

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
