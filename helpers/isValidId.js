import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/isValidId.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(400, `${id} is not valid id`));
  }
  next();
};

export default isValidId;
