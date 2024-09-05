import cloudinary from "../../utils/cloudnairy.js";
import { AppError } from "../../utils/classError.js"
import { asynchandler } from "../../utils/asyncHandler.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import brandmodel from "../../../DB/models/brand.model.js"



// <<<<<<<<<<<<<<<<<<addbrand>>>>>>>>>>>>>>>>>>>>>>>
export const addbrand=asynchandler(async(req,res,next)=>{
    const {name}=req.body;
    const exist=await brandmodel.findOne({name})
    if(exist) {
        return next(new AppError("brand already exist",400))
    }
    if(!req.file){
        return next(new AppError("please upload image",400))
    }
    const customid=nanoid(8)

    const {secure_url, public_id}=await cloudinary.uploader.upload(req.file.path,{
        folder:`Ecommers10/brand/${customid}`

    })
    const brand=await brandmodel.create({
        name,
        slug:slugify(name,{
            replacement:"_",
            lower:true
        }),
        createdby:req.user._id,
        image:{secure_url, public_id},
        customId:customid
        
    })
    return res.status(200).json({brand})
})



// <<<<<<<<<<<<<<<<<<<<<<updatebrand>>>>>>>>>>>>>>>>>>>>>>>>
export const updatebrand=asynchandler(async(req,res,next)=>{
    const {id}=req.params;
    const {name}=req.body;
    const brand= await brandmodel.findOne({_id:id,createdby:req.user.id})
    if(!brand) {
        return next(new AppError("brand not found",404))
        }
    if (name) {
        if (name===brand.name) { 
            return next(new AppError("brand name is same",400))
        }
        if (await brandmodel.findOne({name})) {
            return next(new AppError("brand name is already exist",400))
            
        }
        brand.name=name
        brand.slug=slugify(name,{
            replacement:"_",
            lower:true
        })
    }
    if (req.file) {
        await cloudinary.uploader.destroy(brand.image.public_id)
        const {secure_url, public_id}=await cloudinary.uploader.upload(req.file.path,{
            folder:`Ecommers/brand/${brand.customId}`

        })
        brand.image={secure_url, public_id}

    }
    await brand.save()
    return res.status(200).json({brand})
})

// <<<<<<<<<<<<<<<<<<<<<<getbrand>>>>>>>>>>>>>>>>>>>>>>>>
export const getbrand = asynchandler (async(req,res,next)=>{
    const brand=await brandmodel.find({})

return  res.status(200).json({msg:"done",brand})

})

// <<<<<<<<<<<<<<<<<<<deletebrand>>>>>>>>>>>>>>>>>>
export const deletebrand=asynchandler(async(req,res,next)=>{

    const {id}=req.params
    const brand=await brandmodel.findOneAndDelete({_id:id,createdby:req.user._id})
    if (!brand) {
        return next(new AppError("brand not exist or you dont have permission",400))
    }
    await brandmodel.deleteMany({brand:brand._id})


    await cloudinary.api.delete_resources_by_prefix (`Ecommer10/brand/${brand.customId}`)
    await cloudinary.api.delete_folder(`Ecommers10/brand/${brand.customId}`)
    return res.status(200).json({msg:"done"})
    
})
