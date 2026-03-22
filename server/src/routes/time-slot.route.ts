import { Router } from "express";
import { protect } from "../middlewares/authentication";
import { adminOnly, userOnly } from "../middlewares/authorization";
import { validate } from "../middlewares/validation";
import { createTimeSlotSchema, updateTimeSlotSchema } from "../validation/time-slot";
import { createTimeSlot, deleteTimeSlot, getAllTimeSlots, getAvailableSlotsByConsultant, updateTimeSlot } from "../controller/time-slot.controller";

const router = Router();

router.post("/", protect, adminOnly, validate(createTimeSlotSchema), createTimeSlot);
router.patch("/:id", protect, adminOnly, validate(updateTimeSlotSchema), updateTimeSlot);
router.delete("/:id", protect, adminOnly, deleteTimeSlot);
router.get("/", protect, getAllTimeSlots);
router.get("/consultant/:consultantId/available", protect, getAvailableSlotsByConsultant);


export default router;