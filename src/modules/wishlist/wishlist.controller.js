import wishlistmodel from "../../../DB/models/wishlist.model.js";
import productModel from "../../../DB/models/product.model.js";
import { AppError } from "../../utils/classError.js";
import { asynchandler } from "../../utils/asyncHandler.js";


// <<<<<<<<<<<<<<<<<<<<<<<<addwishlist+>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const addwishlist = asynchandler(async(req,res,next)=>{
    const {title} = req.body
    const product = await productModel.findOne({title})
    if (!product) {
        return next(new AppError('Product not found', 404))        
    }
    const wishList= await wishlistmodel.findOne({user:req.user._id})
    if(!wishList){
        await wishlistmodel.create({user:req.user._id,products:[{productId:product._id}]})
    }else{
        await wishlistmodel.updateOne({user:req.user._id}, {$push:{products:{productId:product._id}}})
    }
    res.status(201).json({message:'Product added to wishlist'})

})