import {Schema,model} from "mongoose";
import { systemroles } from "../../src/utils/systemroles.js"


const userSchema = new Schema({
    
    name:{ 
        type:String,
        required:[ true, "name is required" ],
        minLength:3,
        maxLength:15,
        trim:true
    },
    email:{
        type:String,
        required:[ true, "name is required" ],
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:[true, "password is required"],
        trim:true
    },
    age:{
        type: Number,
        required:[true, " age is required"],
    },
    phone:[String],
    address:[String],
    confirmed:{
        type: Boolean,
        default: false
    },
    loggedIn:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:Object.values(systemroles),
        default:"user"
    },
    code:String,
    changepassword:Date
    }, {
        timestamps:true,
        versionKey: false,

})

const userModel = model("user", userSchema)

export default userModel;