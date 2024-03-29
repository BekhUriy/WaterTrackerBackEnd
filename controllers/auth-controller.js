import User from "../schemas/userSchema.js";
import { createUserSchema } from "../schemas/userSchema.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const signupUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizeEmail = email.toLowerCase().trim()
        const isExist = await User.findOne({ email: email.toLowerCase() })
        if (isExist !== null) {
            req.status(409).json({message: "This email is already in use. Please check email or log in"})
        }
        else {
            
            const validate = createUserSchema.validate({email: normalizeEmail, password: password})
            if (validate.error) {
                return res.status(400).json({message: validate.error.message})
            }
        }

        const hashPassword= await bcrypt.hash(password, 10)
        const data = await User.create({ email: normalizeEmail, password: hashPassword});
        res.status(200).json({ message: 'Welcome, new user! Keep yourself healthy with our Water Tracker' });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
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
        const message = user.name ? `Welcome back, ${user.name}.` : `Welcome back, ${user.email}.`;
        res.status(200).json({ message });
    }
    catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const logoutUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({message: "Logout unsuccessful. Unathorized"})
        }
        await User.findByIdAndUpdate(req.user.id, { token: null })
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error('Error login user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if(user){
            const message = user.name ? `Welcome back, ${user.name}.` : `Welcome back, ${user.email}.`;
            res.status(200).json({ message });
        }
        else {
            res.status(404).json({message:"Unauthorized"})
        }
    }
    catch(error) {
        console.error('Error user:', error);
        res.status(500).json({ message: 'Server error' });
    }
}