import { Router } from "express"
import * as RC from "./reivew.controller.js"
import * as RV  from "./reivew.validation.js"
import { auth} from "../../middleware/auth.js"
import { systemroles } from "../../utils/systemroles.js"
import validation from "../../middleware/validation.js"


const router = Router()





router.post("/",validation(RV.addreviewvalidation),auth([systemroles.user]),RC.addreview)
router.delete("/:id",validation(RV.deleteReview),auth([systemroles.user]),RC.deleteReview)





export default router















