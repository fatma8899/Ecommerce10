import dotenv from "dotenv"
dotenv.config()
import express from "express";
import connectionDB from "./DB/connectionDB.js";
import { AppError } from "./src/utils/classError.js";
import { globalErrorHandling } from "./src/utils/asyncHandler.js";
import userRouter from "./src/modules/users/user.routes.js"
import categoryRouter from "./src/modules/category/category.routes.js";
import subCategoryRouter from "./src/modules/subcategory/subcategory.routes.js";
import brandRouter from "./src/modules/brand/brand.routes.js"
import productRouter from "./src/modules/product/product.routes.js"
import couponRouter from "./src/modules/coupon/coupon.routes.js"
import cartRouter from "./src/modules/cart/cart.routes.js"
import orderRouter from "./src/modules/order/order.routes.js"
import wishlistRouter from "./src/modules/wishlist/wishlist.routes.js"
import reviewRouter from "./src/modules/review/reivew.routes.js";
import cors from "cors"

const app = express();
const port = process.env.PORT || 7001
app.use(cors());

app.get("/", ( req, res) =>{
    res.status(200).json({ msg: "hello on my project" })
})
app.use(express.json());
app.use("/users",userRouter)
app.use("/category",categoryRouter)
app.use("/subcategory",subCategoryRouter)
app.use("/brand",brandRouter)
app.use("/product",productRouter)
app.use("/coupon",couponRouter)
app.use("/cart",cartRouter)
app.use("/order",orderRouter)
app.use("/wishlist",wishlistRouter)
app.use("/review",reviewRouter)

connectionDB()

app.use("*", ( req,res,next )=>{
    return next (new AppError("404 not found"))
})

app.use( globalErrorHandling )

app.listen(7000,()=>{
    console.log(`server is running on port ${port}`)
})