import categorymodel from "../../../DB/models/category.model.js";
import subCategorymodel from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/cloudnairy.js";
import { AppError } from "../../utils/classError.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import { nanoid } from "nanoid";


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const addcategory=asynchandler(async(req,res,next)=>{
    const {name} = req.body;
    const exist = await categorymodel.findOne({name})
    if(exist) {
        return next(new AppError("category already exist",400))
    }
    if(!req.file){
        return next(new AppError("please upload image",400))
    }
    const customid = nanoid(8)
    
    const {secure_url, public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommer10/category/${customid}`
    })
    const category = await categorymodel.create({
        name,
        slug:slugify(name,{
            replacement:"_",
            lower:true
        }),
        createdby:req.user._id,
        image:{secure_url, public_id},
        customId:customid
        
    })
    return res.status(201).json({category})
})

// <<<<<<<<<<<<<<<<<<updatecategory>>>>>>>>>>>>>>>>>>>
export const updatecategory = asynchandler(async(req,res,next)=>{
    const {id} = req.params;
    const {name} = req.body;
    const category= await categorymodel.findOne({_id:id,createdby:req.user.id})
    if(!category) {
        return next(new AppError("category not found",404))
        }
    if (name) {
        if (name===category.name) { 
            return next(new AppError("category name is same",400))
        }
        if (await categorymodel.findOne({name})) {
            return next(new AppError("category name is already exist",400))
            
        }
        category.name = name
        category.slug=slugify(name,{
            replacement:"_",
            lower:true
        })
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const {secure_url, public_id}=await cloudinary.uploader.upload(req.file.path,{
            folder:`Ecommers/category/${category.customId}`

        })
        category.image = {secure_url, public_id}

    }
    await category.save()
    return res.status(200).json({category})
})

// <<<<<<<<<<<<<<<<<<<<<<getcategory>>>>>>>>>>>>>>>>>>>>>>
export const getcategory = asynchandler (async(req,res,next)=>{
    const category=await categorymodel.find({}).populate([
        {path:"subcategory"}
    ])
    
    return  res.status(200).json({msg:"done",category})
})


// <<<<<<<<<<<<<<<<<<deletecategory>>>>>>>>>>>>>>>>>>>>>

export const deletecategory=asynchandler(async(req,res,next)=>{

    const {id}=req.params
    const category=await categorymodel.findOneAndDelete({_id:id,createdby:req.user._id})
    if (!category) {
        return next(new AppError("category not exist or you dont have permission",400))
    }
    await subCategorymodel.deleteMany({category:category._id})


    await cloudinary.api.delete_resources_by_prefix (`Ecommers/category/${category.customId}`)
    await cloudinary.api.delete_folder(`Ecommers/category/${category.customId}`)
    return res.status(200).json({msg:"done"})
    
})