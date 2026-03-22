import { login, logout, register } from "../controller/auth.controller";
import { Router } from "express";
import { protect } from "../middlewares/authentication";
import { validate } from "../middlewares/validation";
import { createUserSchema } from "../validation/user";

const router = Router();

router.post("/register", validate(createUserSchema), register);
router.post("/login", login);
router.post("/logout", protect, logout);

export default router;