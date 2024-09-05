import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js";



// <<<<<<<<<<<<<<<<<addreviewvalidation>>>>>>>>>>>>>>>>>>>>>>>
export const addreviewvalidation ={
    body: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment:Joi.string().required()
    }).required(),
    params:Joi.object({
        productId:Joi.string().required()
    }).required(),
    headers: generalFields.headers.required()
}
// <<<<<<<<<<<<<<<<<deleteReview>>>>>>>>>>>>>>>>>>>>>>>
export const deleteReview ={
    
    params: Joi.object({
        id: generalFields.id.required(),
    }).required(),
    headers: generalFields.headers.required()
}