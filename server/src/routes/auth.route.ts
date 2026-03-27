import { googleLogin, login, logout, refresh, register, updatePhone } from "../controller/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/authentication";
import { validate } from "../middlewares/validation";
import { addPhoneSchema, createUserSchema } from "../validation/user";

const router = Router();

router.post("/register", validate(createUserSchema), register);
router.post("/login", login);
router.post("/google", googleLogin);
router.patch("/update-phone", protect, validate(addPhoneSchema),updatePhone);
router.post("/logout", protect, logout);
router.post("/refresh", refresh);

export default router;