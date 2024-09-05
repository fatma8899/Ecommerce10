import orderModel from "../../../DB/models/order.model.js";
import productModel from "../../../DB/models/product.model.js";
import { AppError } from "../../utils/classError.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import reviewModel from "../../../DB/models/review.model.js";


// <<<<<<<<<<<<<<<<<<<<<<<<addreview>>>>>>>>>>>>>>>>>>>>>>.
export const addreview = asynchandler(async(req,res,next)=>{
    const { title,rating,comment}=req.body;
    // const {productId}=req.params;
    const proudct = await productModel.findOne({title})
    if(!proudct){
        return next(new AppError("Product not found",404))
    }
    const order= await orderModel.findOne({user:req.user._id, status:"deliverd"})
    if (!order) {
        return next(new AppError("should make order",404))
    
    }
    const reviewexist = await reviewModel.findOne({createdBy:req.user._id})
    if(reviewexist){
        return next(new AppError("you have already review this product",404))
        }
        const review = await reviewModel.create({
            comment,
            rating,
            createdBy:req.user._id,
            productId:proudct._id
        })
        if (!review) {
            return next(new AppError("review not created",404))
            
        }
        let sum = proudct.rateAvg * proudct.rateNum
        sum = sum + rating
        proudct.rateAvg = sum / (proudct.rateNum + 1)
        proudct.rateNum += 1
        await proudct.save()
        res.status(201).json({message:"review created successfully",review})
})


// <<<<<<<<<<<<<<<<<<<deleteReview>>>>>>>>>>>>>>>>>>>>>>>>>
export const deleteReview = asynchandler(async (req, res, next)=> {
    const { id } = req.params

    const review = await reviewModel.findOneAndDelete(
        {_id:id, createdBy: req.user._id}
    )
    if (!review) {
        return next(new AppError("review not exist",409))
    }

    const product = await productModel.findById(review.productId)

    let sum = product.rateAvg * product.rateNum
    sum = sum - review.rate

    product.rateAvg = sum / ( product.rateNum - 1)
    product.rateNum -= 1

    await product.save()

    res.status(201).json({ msg : "done", review })
})