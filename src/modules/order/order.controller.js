import productModel from "../../../DB/models/product.model.js";
import orderModel from "../../../DB/models/order.model.js";
import { asynchandler } from "../../utils/asyncHandler.js"; 
import { AppError } from "../../utils/classError.js";
import couponModel from "../../../DB/models/coupon.model.js";
import cartModel from "../../../DB/models/cart.model.js";
import { createInvoice } from "../../utils/pdf.js"
import Stripe from "stripe";
import { payments } from "../../utils/payment.js";
import sendEmail  from "../../service/sendEmail.js"


// <<<<<<<<<<<<<<<<<createorder>>>>>>>>>>>>>>>>>>>>>
export const createorder= asynchandler(async(req,res,next)=>{
    const {productId,quantity,couponcode,address,phone,paymentMethod}=req.body;
    const coupon = await couponModel.findOne({ code: couponcode,
            usedBy:{$nin: [req.user._id] },

    })
    if (couponcode) {
        
        if (!coupon|| coupon.toDate < Date.now()) {
            return next(new AppError("Invalid Coupon or expired", 400));
        }
        req.body.coupon = coupon 
        
    }
    let products = []
    let flag = false
    if (productId) {
        products = [{productId,quantity}]
        
    } else{
        const cart = await cartModel.findOne({user:req.user._id})
        if(!cart.products.length){
            return next(new AppError("Cart is empty", 400))
    }
    products = cart.products
    flag = true
}
    let finalproudcts= []
    let subPrice = 0
    for (let product of products){

        const checkproduct = await productModel.findOne({_id:product.productId,stock:{$gte:product.quantity}})
        
        if(!checkproduct){
            return next(new AppError("Product is out of stock", 400))
            }
            if (flag) {
                product= product.toObject()
                
            }
            product.title=checkproduct.title
            product.price=checkproduct.price
            product.finalPrice=checkproduct.subPrice
            subPrice+=product.finalPrice
            finalproudcts.push(product)
    }
    const order= await orderModel.create({
        user:req.user._id,
        products:finalproudcts,
        subPrice,
        couponId:req.body?.coupon?._id,
        totalPrice:subPrice-(subPrice*(req.body?.coupon?.amount||0) /100 ),
        paymentMethod,
        status:"waitPayment",
        address,
        phone
    })
    
    if(!order){
        return next(new AppError("Failed to create order", 400))
    }
    if (coupon) {
        await couponModel.updateOne({_id:coupon._id},{$push:{usedBy:req.user._id}})
        
    }
    if (flag) {
        await cartModel.updateOne({user:req.user_id},{products:[]})
        
    }
    const invoice={
        shipping:{
            name:req.user.name,
            address: req.user.address,
            city:"egypt",
            state:"cairo",
            country:"cairo",
            postal_code:47111
        },
        items:order.products,
        subtotal:order.subPrice,
        paid:order.finalPrice,
        invoivce_nr:order._id,
        date: order.createdAt,
        coupon: req.body?.coupon?.amount || 0 
        }
    
        await createInvoice(invoice,"invoice.pdf")
        await sendEmail(req.user.email,`order placed`,`order is arraived`,[
            {
            path: `invoice.pdf`,
            contentType: `application/pdf`
        }
    ])
    ////////////////////////////////////////////////////////////////////////////////////
    if (paymentMethod == "visa") {
        const stripe = new Stripe(process.env.strip_secret)

        if (req.body?.coupon) {
            const coupon = await stripe.coupon.create({
                percent_off: req.body.coupon.amount,
                duration: "once"
            })
            req.body.couponId = coupon.id
        }

        const session = await payments({
            stripe,
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: req.user.email,
            metadata: {
                orderId: order._id.toString()
            },
            success_url: `${req.protocol}://${req.headers.host}/order/success/${order._id}`,
            cancel_url: `${req.protocol}://${req.headers.host}/order/cancelled/${order._id}`,
            line_items: order.products.map((product) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.title,
                        },
                        unit_amount: product.price * 100
                    },
                    quantity: product.quantity
                }
            }),
            discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : []
        })
        return res.json({ msg: "done", url: session.url,order})
}
    
    return res.json({msg:"done",order})

})



// <<<<<<<<<<<<<<<<<<<<<<<webhook>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
export const webhook = asynchandler(async (req, res, next) => {
    const Stripe = new Stripe(process.env.strip_secret)
    const sig = req.headers['Stripe-signature'];

    let event;

    try {
        event = Stripe.webhooks.constructEvent(req.body, sig, process.env.endpoint);
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const { orderId } = event.data.object.metadata;
    if (event.type = ! 'checkout.session.completed') {


        await orderModel.updateOne({ _id: orderId }, { status: "reject" })
        return res.json({ msg: "failed" })
    }
    await orderModel.updateOne({ _id: orderId }, { status: "placed" })
    return res.json({ msg:"done"})


});



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<cancelOrder>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const cancelOrder= asynchandler(async(req,res,next)=>{
    const {id}=req.params
    const {reason}=req.body
    const order=await orderModel.findOne({_id:id,user:req.user._id})
    if(!order){
        return next(new AppError("Order not found",404))
    }
        if(order.paymentMethod === "cash" && order.status != "placed"|| order.paymentMethod === "visa" && order.status != "waitPayment"){
            return next(new AppError("Order status is not valid",400))
        }
        await orderModel.findOneAndUpdate({user:req.user._id},{
            status:"cancelld",
            canceldBy:req.user._id,
            reason
        })
        if (order?.couponId) {
            await couponModel.findOneAndUpdate({_id:order?.couponId},{
                $pull:{usedBy:req.user._id}
            })
            
        }
        for (const product of order.products){
            await productModel.findOneAndUpdate({_id:product.productId},{
                $inc:{stock:product.quantity}
            })
        }
        return res.json({msg:"done"})
})