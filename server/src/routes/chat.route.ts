import { sendMessage } from "../controller/chat.controller";
import { Router } from "express";
import { protect } from "../middlewares/authentication";
import { userOnly } from "../middlewares/authorization";

const route = Router()

route.post('/',protect,userOnly,sendMessage)

export default route