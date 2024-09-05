import { Router } from "express";
import * as CC from "./category.controller.js";
import * as CV from "./category.validation.js";
import { multerHost, filtration } from "../../middleware/multer.js";
import { auth } from "../../middleware/auth.js";
import { systemroles } from "../../utils/systemroles.js";
import validation from "../../middleware/validation.js";
import subCategoryRouter from "../../modules/subcategory/subcategory.routes.js"
const router = Router()



router.post("/",multerHost(filtration.image).single("image"),
validation(CV.addCategoryValidation),auth([systemroles.user]),CC.addcategory)

router.put("/updated/:id",multerHost(filtration.image).single("image"),
validation(CV.updatebrandValidation),auth([systemroles.user]),CC.updatecategory)

router.get("/",CC.getcategory)

router.delete("/delete/:id",auth(Object.values(systemroles)),CC.deletecategory)

export default router