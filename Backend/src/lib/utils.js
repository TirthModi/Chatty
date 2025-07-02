import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // prevents XSS attacks cross-site scripting
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict' // prevents CSRF attacks cross-site request forgery
    });
    
    return token;
}