import express from "express"
import { Router }from "express"
import * as OC from "./order.controller.js"
import * as OV from "./order.validation.js"
import { auth } from "../../middleware/auth.js"
import { systemroles } from "../../utils/systemroles.js"
import validation from "../../middleware/validation.js"
const router=Router()



router.post("/add",validation(OV.createordervalidation),auth(Object.values(systemroles)),OC.createorder)

router.put("/:id",validation(OV.cancelOrdervalidation),auth(Object.values(systemroles)),OC.cancelOrder)



export default router
