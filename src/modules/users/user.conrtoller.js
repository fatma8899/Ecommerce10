import userModel from "../../../DB/models/user.model.js";
import sendEmail from "../../service/sendEmail.js";
import { asynchandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/classError.js";
import jwt from "jsonwebtoken";
import bcrypt, { compare, compareSync } from "bcrypt";
import { customAlphabet, nanoid } from "nanoid";


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<signUp>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const signUp = asynchandler(async(req,res,next)=>{
    const {name,email,password,cpassword,age,phone,address}=req.body
    
    const exist= await userModel.findOne({email})
    if (exist) {
        return next(new AppError("email already exist")) 
        }
        const token = jwt.sign({ email }, process.env.mypass, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`
    const reftoken = jwt.sign({ email }, process.env.refpass)
    const reflink = `${req.protocol}://${req.headers.host}/users/reconfirmEmail/${reftoken}`
    
    const checkSendEmail = await sendEmail(email, "hello", `<a href="${link}">confirm your email</a> <br>
        <a href='${reflink}'>click to resend the link</a>   `)
    if (!checkSendEmail) {
        return next(new AppError("Email not sent"))
    }   
    const hash= bcrypt.hashSync(password,+process.env.round)
    const user= await userModel.create({name,email,password:hash,age,phone,address})
    if (!user) {
        return next(new AppError("cant sign up"))
        
    }
    return res.json({msg:"done",user})
})

//<<<<<<<<<<<<<<<<<<<<<<<confirmEmail>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const confirmEmail = asynchandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.mypass)
    if (!decoded?.email) {
        return next(new AppError("invalid token"))
    }
    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true }, { new: true })
    if (!user) {
        return next(new AppError("user not found or already confirmed"))
    }
    return res.json({ msg: "done" })
})


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<refConfirmEmail>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const refConfirmEmail = asynchandler(async (req, res, next) => {
    const { reftoken } = req.params
    const decoded = jwt.verify(reftoken, process.env.refpass)
    if (!decoded?.email) {
        return next(new AppError("invalid reftoken"))
    }
    const token = jwt.sign({ email }, process.env.mypass, { expiresIn: 60 * 5 })
    const link = `${req.protocol}://${req.headers.host}/users/confirmEmail/${token}`
    await sendEmail(email, "hi", `<a href='${link}'>click to confirm your email</a>`)
    return res.json({ msg:"done"})
})

//<<<<<<<<<<<<<<<<<<<<<<<<<<<signIn>>>>>>>>>>>>>>>>>>>>>>...
export const signIn=asynchandler(async(req,res,next)=>{
    const {email,password}=req.body
    const user=await userModel.findOne({email,confirmed:true})
    if(!user){
        return next(new AppError("invalid email"))
    }
    const isMatch= bcrypt.compareSync(password,user.password)
    if(!isMatch){
        return next(new AppError("invalid password"))
        }
        const token=jwt.sign({email,id:user._id},process.env.name)
        if (!token) {
            return next(new AppError("invalid token"))
            
        }
        await userModel.updateOne({email,loggedIn:false},{loggedIn:true},{new:true})
        
        return res.json({msg:"done",token})
})


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<forgetPassword>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.
export const forgetPassword= asynchandler(async(req,res,next)=>{
    const {email}=req.body
    const user= await userModel.findOne({email,confirmed:true})
    if(!user){
        return next(new AppError("user not found"))
        }
        const code= customAlphabet("0123456789",+process.env.code)
        const coded= code() 
        await sendEmail(email,"use this code",`<h1>code is${coded}</h1>`)
        await userModel.updateOne({email},{code:coded})
        return res.json({msg:"done"})
})


//<<<<<<<<<<<<<<<<<<<<resetpassword>>>>>>>>>>>>>>>>>>>>>>>>>
export  const resetpassword= asynchandler(async(req,res,next)=>{
    const {email,code,password,cpassword}=req.body
    const user=await userModel.findOne({email,confirmed:true})
    if(!user){
        return next(new AppError("user not found"))
        }
        if(user.code!==code){
            return next(new AppError("invalid code"))
            }
            const hash=bcrypt.hashSync(password,+process.env.round)
            await userModel.updateOne({email},{password:hash,code:"",changepassword:Date.now()},{new:true})
            return res.json({msg:"done"})
})


//<<<<<<<<<<<<<<<<<<<<<<<getData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const getData=asynchandler(async(req,res,next)=>{
    const {id}= req.params
    const user= await userModel.findOne({_id:id,loggedIn:true})
    if(!user){
        return next(new AppError("user not found"))
        }
        return res.json({user})
})


//<<<<<<<<<<<<<<<<<<<<<<<<<<<<deleteUser>>>>>>>>>>>>>>>>>>>>>>>>>>.
export const deleteUser=asynchandler(async(req,res,next)=>{
    const user=await userModel.findOneAndDelete({_id:req.user.id})
    if(!user){
        return next(new AppError("cant delete user"))
        }
        return res.json({msg:"done"})
})
