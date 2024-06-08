import Joi from "joi";

export const createUserSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),  
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});