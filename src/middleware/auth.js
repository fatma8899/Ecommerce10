import jwt from "jsonwebtoken";
import userModel from "../../DB/models/user.model.js";

export const auth = (roles = []) =>{
    return async (req, res, next) =>{
        try{
            const { token } = req.headers
            if (!token) {
                return res.status(400).json({ msg:"token not exist" })
            }
            if (!token.startsWith(process.env.secret)) {
                return res.status(400).json({ msg:"ivalid bearer key" })
            }
            const newToken = token.split(process.env.secret)[1]
            if(!newToken) {
                return res.status(400).json({ msg:"invalid token" })
            }
            const decoded = jwt.verify(newToken, process.env.name)
            if (!decoded?.email) {
                return res.status(400).json({ msg:"invalid payload" })
            }
            const user = await userModel.findById(decoded.id)
            if (!user) {
                return res.status(409).json({ msg:"user not exist" })
            }
            if (!roles.includes(user.role)){
                return res.status(401).json({ msg:"you dont have permission"})
            }
            req.user = user
            next()
        }catch (error) {
            return res.status(400).json({ msg:"catch error in auth"})
        }
    }
}