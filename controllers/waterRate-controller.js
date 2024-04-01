import HttpError from '../helpers/HttpError.js'
import User from '../schemas/userSchema.js';

export const waterRate=async(req,res,next)=>{
    try {
          const {_id} = req.user;
          console.log('req.user', req.user)
          console.log('req.body', req.body)
          const updatedUser = await User.findByIdAndUpdate(_id, req.body,  {
            new: true,
          })
          if (!updatedUser) {
            throw HttpError(404);
          }
          res.json(updatedUser);
    } catch (error) {
        next(error)
    }
}