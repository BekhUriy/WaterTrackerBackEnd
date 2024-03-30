import jwt from "jsonwebtoken"
import User from "../schemas/userSchema.js";

export const auth = async (req, res, next) => {

    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(' ');


    if (bearer !== 'Bearer') {
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const { id } = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        req.user = user;
        next(); 
    } catch (error) {
        console.error('Error auth:', error);
        res.status(500).json({ message: 'Server error' });
    }

};

export default auth;
