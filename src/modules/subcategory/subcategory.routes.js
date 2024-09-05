import { Router } from "express";
import * as SC from "./subcategory.controller.js"
import * as SV from "./subcategory.validation.js"
import { multerHost, filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js"
import { systemroles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js"
const router = Router()



router.post("/add",multerHost(filtration.image).single("image"),
validation(SV.addCategoryValidation),auth([systemroles.user]),SC.addsubcategory)

router.put("/updated/:id",multerHost(filtration.image).single("image"),
validation(SV.updatesubCategoryValidation),auth([systemroles.user]),SC.updateSubCategory)

router.get("/",SC.getsubCategory)

router.delete("/delete/:id",auth(Object.values(systemroles)),SC.deletesubcategory)



export default router