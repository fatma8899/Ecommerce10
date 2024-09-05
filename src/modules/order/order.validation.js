import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

// <<<<<<<<<<<<<<<<<createordervalidation>>>>>>>>>>>>>>>>>>
export const createordervalidation={
    body:Joi.object({
        couponCode:Joi.string().min(3).max(30),
        phone: Joi.string().required(),
        address:Joi.string().required(),
        productId:generalFields.id,
        quantity:Joi.number(),
        paymentMethod:Joi.string().valid("cash","visa").required(),
    }),
    headers:generalFields.headers.required()

}

// <<<<<<<<<<<<<<<<<<<cancelOrdervalidation>>>>>>>>>>>>>>>>>>>
export const cancelOrdervalidation={
    body:Joi.object({
        reason:Joi.string().required()
        }),
        params:Joi.object({
            id:generalFields.id.required()
        }),
        headers:generalFields.headers.required()
}