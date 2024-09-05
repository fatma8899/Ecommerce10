import Joi from "joi"
import  { generalFields } from "../../utils/generalFields.js" 




export const addwishlistvalidation= {
    // params: Joi.object({
    //     productId:generalFields.id.required()

    // }).required(),
    headers: generalFields.headers.required(),
    body: Joi.object({
        title:Joi.string().required()    
    }).required()
}