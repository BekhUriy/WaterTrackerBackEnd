import Joi from "joi";

export const dateSchema = Joi.date()
.max('now')
.required() ;