import subCategorymodel from "../../../DB/models/subcategory.model.js";
import cloudinary from "../../utils/cloudnairy.js";
import { AppError } from "../../utils/classError.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import categorymodel from "../../../DB/models/category.model.js";


// <<<<<<<<<<<<<<<<<<<addsubcategory>>>>>>>>>>>>>>>>>
export const addsubcategory = asynchandler(async(req,res,next)=>{
    const {name,category} = req.body;
    const categoryy = await categorymodel.findById(category)
    if(!categoryy) {
        return next(new AppError("category not found",404))
    }

    const exist = await subCategorymodel.findOne({name})
    if(exist) {
        return next(new AppError("subcategory already exist",400))
    }
    if(!req.file){
        return next(new AppError("please upload image",400))
    }
    const customid = nanoid(8)

    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommers10/category/${categoryy.customId}/subcategory/${customid}`

    })
    const subcategory = await subCategorymodel.create({
        name,
        slug:slugify(name,{
            replacement:"_",
            lower:true
        }),
        createdby:req.user._id,
        image:{secure_url, public_id},
        customId:customid,category
        
    })
    return res.status(200).json({subcategory})
})

// <<<<<<<<<<<<<<<updateSubCategory>>>>>>>>>>>>>>>
export const updateSubCategory = asynchandler(async (req, res, next) => {
    const { name } = req.body
    const { id } = req.params
    const subcategory = await subCategorymodel.findOne({ _id: id, createdby: req.user._id })
    if (!subcategory) {
        return next(new AppError("subcategory not found"))
    }
    if (name) {
        if (name === subcategory.name) {
            return next(new AppError("failed it is the same name"))
        }
        if (await subCategorymodel.findOne({ name })) {
            return next(new AppError("name already exist"))
        }
        subcategory.name = name
        subcategory.slug = slugify(name, {
            replacement: '_',
            lower: true,
        })
    }
    const category = await categorymodel.findOne({ _id: subcategory.category })
    if (!category) {
        return next(new AppError("category not found"))
    }
    if (req.file) {
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommers10/category/${category.customId}/subcategory/${subcategory.customId}`
        })
        subcategory.image = { secure_url, public_id }
    }
    await subcategory.save()

    return res.status(200).json({ msg: "done", subcategory})
})

// <<<<<<<<<<<<<<<<<<<<<getsubCategory>>>>>>>>>>>>>>>>>>>>>>
export const getsubCategory = asynchandler (async(req,res,next)=>{
    const subcategory=await subCategorymodel.find({})


return  res.status(200).json({msg:"done",subcategory})

})

// <<<<<<<<<<<<<<<<<<<<<<<<<deletesubcategory>>>>>>>>>>>>>>>>>>>>>>>>
export const deletesubcategory=asynchandler(async(req,res,next)=>{

    const {id}=req.params
    const subcategory=await subCategorymodel.findOneAndDelete({_id:id,createdby:req.user._id})
    if (!subcategory) {
        return next(new AppError("subcategory not exist or you dont have permission",400))
    }
    await subCategorymodel.deleteMany({subcategory:subcategory._id})


    await cloudinary.api.delete_resources_by_prefix (`Ecommers/subcategory/${subcategory.customId}`)
    await cloudinary.api.delete_folder(`Ecommers/subcategory/${subcategory.customId}`)
    return res.status(200).json({msg:"done"})
    
})
