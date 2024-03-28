import HttpError from '../helpers/HttpError.js'
export const waterRate=async(req,res,next)=>{
    try {
          const {_id} = req.user;
          const updatedUser = await User.findByIdAndUpdate(_id, req.body)
          if (!updatedUser) {
            throw HttpError(404);
          }
          res.json(updatedUser);
    } catch (error) {
        next(error)
    }
}