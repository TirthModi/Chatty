import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({email})
        if(user) {
            return res.status(400).json({ message: "User already exists" });
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            profilepic: ""
        });
    
        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({ 
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilepic: newUser.profilepic,
            });
        } else {
            res.status(400).json({ message: "Invalid User data" });
        }
    
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({ email })
            
        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            console.error("Invalid credentials for user:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        console.log("User logged in successfully:", user._id);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilepic: user.profilepic,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};   

export const logout = async (req, res) => {
    try{
        res.cookie('token', '', {
            maxAge: 0, // Set cookie to expire immediately
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict'
        });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try{
        const {profilepic} = req.body;
        const userId = req.user._id; // Get user ID from the request object
        if(!profilepic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadresponse = await cloudinary.uploader.upload(profilepic)
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { profilepic: uploadresponse.secure_url },
            { new: true } 
        );
        res.status(200).json(updatedUser);        

    } catch (error) {
        console.log("Error during profile update:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Error checking authentication:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};