import { Router } from "express";
import * as WV from "./wishlist.validation.js"
import * as WC from "./wishlist.controller.js"
import { auth } from "../../middleware/auth.js";
import { systemroles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"



const router = Router()



router.post("/",validation(WV.addwishlistvalidation),auth([systemroles.user]),WC.addwishlist)

export default router
