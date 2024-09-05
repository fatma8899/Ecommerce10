import { Router } from "express"
import * as PC from "./product.controller.js"
import * as PV from "./product.validation.js"
import { multerHost,filtration } from "../../middleware/multer.js"
import { auth } from "../../middleware/auth.js"
import { systemroles } from "../../utils/systemroles.js"
import validation from "../../middleware/validation.js"

const router = Router()

router.post("/add", multerHost(filtration.image).fields([
    { name: "image", maxCount: 1 },
    { name: "coverimages", maxCount: 3 },
]),
    validation(PV.addProductValidation), auth([systemroles.user]), PC.addProduct)



router.put("/update/:id",multerHost(filtration.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverimages", maxCount: 3 },
]),
    validation(PV.updateproductvalidation), auth([systemroles.user]), PC.updateproduct)


router.get("/", PC.getproduct)




export default router