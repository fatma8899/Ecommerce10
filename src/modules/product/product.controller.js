import productModel from  "../../../DB/models/product.model.js";
import { AppError } from "../../utils/classError.js";
import cloudnairy from "../../utils/cloudnairy.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import { nanoid } from "nanoid";
import slugify from "slugify";
import categorymodel from "../../../DB/models/category.model.js";
import subCategorymodel from "../../../DB/models/subcategory.model.js";
import brandmodel from "../../../DB/models/brand.model.js";
import {apifeatures} from "../../utils/apifeatures.js";



// <<<<<<<<<<<<<<<addProduct>>>>>>>>>>>>>>>>>
export const addProduct = asynchandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body

    const categoryExist = await categorymodel.findById(category)
    if (!categoryExist) {
        return next(new AE.AppError("category not exist", 400))
    }

    const subCategoryExist = await subCategorymodel.findById(subCategory)
    if (!subCategoryExist) {
        return next(new AE.AppError("subCategory not exist", 400))
    }

    const brandExist = await brandmodel.findById(brand)
    if (!brandExist) {
        return next(new AppError("brand not exist", 400))
    }

    const exist = await productModel.findOne({ title })
    if (exist) {
        return next(new AppError("Product title already exist", 400))
    }

    if (!req.files) {
        return next(new("Please upload a product image", 400));
    }
    
    const subPrice = price - (price * (discount || 0) / 100)
    const customId = nanoid(5)
    let list = []

    for (const file of req.files.coverimages) {
        const { secure_url, public_id } = await cloudnairy.uploader.upload(file.path, {
            folder: `Ecommer10/category/${categoryExist.customId}/subcategory/${subCategoryExist.customId}/products/${customId}`
        })
        list.push({ secure_url, public_id })
    }
    const { secure_url, public_id } = await cloudnairy.uploader.upload(req.files.image[0].path, {
        folder: `Ecommer10/category/${categoryExist.customId}/subcategory/${subCategoryExist.customId}/products/${customId}`
    })

    const product = await productModel.create({
        title,
        description,
        category,
        subCategory,
        brand,
        createdBy: req.user._id,
        price,
        discount,
        stock,
        image: { secure_url, public_id },
        coverimages: list,
        slug: slugify(title, {
            replacement: '_',
            lower: true,
        }),
        subPrice,
        customId
    })
    if (!product) {
        return next(new AppError("Failed to create product", 400))
    }
    return res.json({ msg: "done",product})
})



// <<<<<<<<<<<<<<<<<<<updateproduct>>>>>>>>>>>>>>>>>>>>>>>>>.
export const updateproduct = asynchandler(async(req,res,next)=>{
    const { title, description, category, subCategory, brand, price, discount, stock }=req.body
    const {id}= req.params
    const categoryExist = await categorymodel.findOne({_id:category})
    if (!categoryExist) {
        return next(new("Category not found", 400))
        
    }
    const subCategoryExist = await subCategorymodel.findOne({ _id: subCategory })
    if (!subCategoryExist) {
        return next(new AppError("Subcategory not found", 400))
    }
    const brandExist =  await brandmodel({_id:brand})
    if (!brandExist) {
        return next(new AppError("Brand not found", 400))
        }
        const product = await productModel.findOne({_id:id,createdBy:req.user._id})
        if (!product) {
            return next(new AppError("Product not found", 400))
        }
        if (title) {
            if (title == product.title){
                return next(new AppError("Title already exist", 400))
            }
            product.title = title
            product.slug = slugify(title,{
                replacement: '_',
                lower: true,
            })
        }
        if (description) {
            product.description = description
        }
        if (stock) {
            product.stock = stock
        }
        if (price & discount) {
            product.subPrice = price - (price * discount / 100)
            product.price = price
            product.discount = discount
        } else if (price){
            product.subPrice = price - (price * product.discount / 100)
            product.price = price
        } else if (discount){
            product.subPrice = product.price - (product.price * discount / 100)
            product.discount = discount
        }
        if (req.files){
            if (req.files?.image?.lenth){
                await cloudnairy.uploader.destroy(product.image.public_id)
                const {secure_url,public_id} = await cloudnairy.upload(req.files.image[0].path,{
                    folder: `Ecommers/category/${categoryExist.customId}/subcategory/${subCategoryExist.customId}/products/${customId}`
                })
                product.image = {secure_url,public_id}
            }
            if (req.files?.coverimages?.lenth){
                await cloudnairy.api.delete_resources_by_prefix(`Ecommers/category/${categoryExist.customId}/subcategory/${subCategoryExist.customId}/products/${customId}`)
                let list = []
                for ( const file of req.files.coverimages){
                    const {secure_url,public_id} = await cloudnairy.uploader.upload(file.path,{
                        folder: `Ecommers/category/${categoryExist.customId}/subcategory/${subCategoryExist.customId}/products/${product.customId}`
                })
                list.push({secure_url,public_id})
            }
            product.coverimages = list

        }
    }
    await product.save()

    return res.json({msg:"done",product})
})

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<getproduct>>>>>>>>>>>>>>>>>>>>
export const getproduct = asynchandler(async(req,res,next)=>{
    const Apifeatures = new apifeatures(productModel.find(),req.query)
    .pagination()
    .filter()
    .search()
    .select()
    .sort()
    const product = await Apifeatures.mongooseQuery
    if (!product) {
        return next(new AppError("No product found", 404))
    }
    return res.json({ msg: "done",product,page:Apifeatures.page})
})