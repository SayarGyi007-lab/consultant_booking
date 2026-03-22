import { changePassword, getCurrentUser, getUserById, getUsers, permanentDeleteUser, restoreUser, softDeleteUser, updateUser } from "../controller/user.controller";
import { Router } from "express";
import { protect } from "../middlewares/authentication";
import { adminOnly, Both, userOnly } from "../middlewares/authorization";
import { validate } from "../middlewares/validation";
import { changePasswordSchema, updateUserSchema } from "../validation/user";

const router = Router();

router.patch("/change-password", protect, userOnly, validate(changePasswordSchema), changePassword);
router.patch("/:id", protect, userOnly, validate(updateUserSchema), updateUser);
router.patch("/:id/archive", protect, adminOnly, softDeleteUser);
router.patch("/:id/restore", protect, adminOnly, restoreUser);
router.delete("/:id", protect, adminOnly, permanentDeleteUser);

router.get("/me", protect, Both, getCurrentUser);
router.get("/", protect, adminOnly, getUsers);


export default router;