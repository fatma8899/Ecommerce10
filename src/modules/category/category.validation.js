import Joi from "joi"

// <<<<<<<<<<<<<<<<addCategoryValidation>>>>>>>>>>>>>>>>>>>>>
export const addCategoryValidation = {
    body: Joi.object({
        name: Joi.string().required(),
    }).required(),
    file: Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        destenation: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required()
    }).required(),
    headers: Joi.object({
        token: Joi.string().required(),
        'cache-control': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'user-agent': Joi.string(),
        'postman-token': Joi.string(),
    }).required()
}



// <<<<<<<<<<<<<<<<<<<<<<<<updatebrandValidation>>>>>>>>>>>>>>>>>>>>>>>
export const updatebrandValidation = {
    body: Joi.object({
        name: Joi.string()
    }).required(),
    file: Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        destenation: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required()
    }).required(),
    headers: Joi.object({
        token: Joi.string().required(),
        'cache-control': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        host: Joi.string(),
        connection: Joi.string(),
        'user-agent': Joi.string(),
        'postman-token': Joi.string(),
    }).required(),
    params: Joi.object({
    id: Joi.string().required()
    }).required()

}