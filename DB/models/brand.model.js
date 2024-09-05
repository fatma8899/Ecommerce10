import { Schema,model } from "mongoose"
const brandSchema=new Schema({
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
    versionKey:false,
    toJSON: {virtuals:true},
    toObject: {virtuals:true},
})
const brandmodel=model("brand",brandSchema)

export default brandmodel
