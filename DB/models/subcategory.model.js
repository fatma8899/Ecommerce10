import { Schema,model } from "mongoose";

const subCategorySchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        },
        slug:{
            type:String,
            required:true,
            trim:true
            },
    createdby:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },
    image:{
        secure_url:String,
        public_id:String,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'category',
    },
    customId:String

},{
    timestamps:true,
    versionKey:false
})

const subCategorymodel = model("subcategory", subCategorySchema)

export default subCategorymodel