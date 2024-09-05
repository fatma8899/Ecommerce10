import { Router } from "express";
import * as CC from "./cart.controller.js"
import * as CV from "./cart.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js";
import { systemroles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()

router.post("/add", validation(CV.addCartValidation), auth(Object.values(systemroles)), CC.addCart)

router.put("/remove", validation(CV.removeCartValidation), auth(Object.values(systemroles)), CC.removeCart)

router.put("/clear", validation(CV.clearCartValidation), auth(Object.values(systemroles)), CC.clearCart)



export default router