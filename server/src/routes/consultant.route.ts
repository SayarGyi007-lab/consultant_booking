import { protect } from "../middlewares/authentication";
import { createConsultant, getConsultantById, getConsultants, permanentDeleteConsultant, restoreConsultant, softDeleteConsultant, updateConsultant } from "../controller/consultant.controller";
import { Router } from "express";
import { adminOnly } from "../middlewares/authorization";
import { validate } from "../middlewares/validation";
import { createConsultantSchema, updateConsultantSchema } from "../validation/consultant";


const router = Router();

router.post("/register", protect, adminOnly, validate(createConsultantSchema), createConsultant);
router.patch("/:id", protect, adminOnly, validate(updateConsultantSchema), updateConsultant);
router.patch("/:id/archive", protect, adminOnly, softDeleteConsultant);
router.patch("/:id/restore", protect, adminOnly, restoreConsultant);
router.delete("/:id", protect, adminOnly, permanentDeleteConsultant);
router.get("/", protect, getConsultants);
router.get("/:id", protect, getConsultantById);

export default router;