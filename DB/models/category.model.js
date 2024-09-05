import { Schema,model } from "mongoose";

const categorySchema = new Schema({
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
    customId:String

},{
    timestamps:true,
    versionKey:false
})

const categorymodel = model("category", categorySchema)

export default categorymodel