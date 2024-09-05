import express from "express";
import * as UC from "../users/user.conrtoller.js"
import { auth } from "../../middleware/auth.js"
import { systemroles } from "../../utils/systemroles.js";

const router = express()



router.post("/signup",UC.signUp)
router.get("/confirmEmail/:token",UC.confirmEmail)
router.get("/reconfirmEmail/:reftoken",UC.refConfirmEmail)
router.get("/signin",UC.signIn)
router.put("/forget",UC.forgetPassword)
router.put("/reset",UC.resetpassword)
router.get("/data/:id",UC.getData)
router.delete("/deleted/",auth([systemroles.user]),UC.deleteUser)



export default router