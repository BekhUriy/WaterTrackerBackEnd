
import User, { updateUserSchema } from "../schemas/userSchema.js";
import * as fs from 'node:fs/promises'
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';

export const updateUser = async (req, res) => {
    try {
        const { name, gender } = req.body
        const normalizedName = name.trim()
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({message: "Update unsuccessful. Unathorized"})
        }
      
        const validationResult = updateUserSchema.validate({
            name: normalizedName,
            gender: gender,
        })

        if (!validationResult) {
            return res.status(400).json({ message: validationResult.error.message });
        }


        await User.findByIdAndUpdate(req.user.id, { name: normalizedName, gender })
        const updatedUser = await User.findById(req.user.id);
        console.log(updatedUser)
        const responseData = {
            
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatarURL: updatedUser.avatarURL,
                gender: updatedUser.gender,
                waterRate: updatedUser.waterRate,
                verify: updatedUser.verify,
            },
            message: `Update is successful`,
        };

         return res.status(200).json(responseData);
        
    } catch (error) {
        console.error('Error updating:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
       
        const responseData = {
            token: user.token,
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
        
    } catch (error) {
        console.error('Error getting data:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const uploadAvatar = async (req, res) => {
    
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    const options = {
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    try {
        const user = User.findById(req.user.id)
        if (!user) {
            return res.status(401).json({message: "Avatar upload unsuccessful. Unathorized"})
        }
        const imagePath = req.file.path
        
        const result = await cloudinary.uploader.upload(imagePath, {
            ...options,
                transformation: [
                { width: 250, height: 250, gravity: 'faces', crop: 'thumb' },
                { radius: 'max' }, 
            ],});
        const cloudinaryBaseUrl = process.env.CLUDINARY_URL;
        const avatarUrl = cloudinaryBaseUrl + result.public_id;
        await User.findByIdAndUpdate(req.user.id, { avatarURL: avatarUrl })
        if (res.status(200)) {
            await fs.unlink(imagePath);
        }
        const updatedUser = await User.findById(req.user.id);
        console.log(updatedUser)
        const responseData = {
            
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatarURL: updatedUser.avatarURL,
                gender: updatedUser.gender,
                waterRate: updatedUser.waterRate,
                verify: updatedUser.verify,
            },
            message: `Update is successful`,
        };

         return res.status(200).json(responseData);

        
    } catch (error) {
      console.error(error);
    }
}

